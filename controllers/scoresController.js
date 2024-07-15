// const dbDebugger = require("debug")("app:db");
const Student = require("../models/studentModel");
const Staff = require("../models/staffModel");
const Score = require("../models/scoreModel");
const sClass = require("../models/classModel");
const CardDetails = require("../models/carddetailsModel");
const { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } =
  require('../middleware/errors')
const {
  addScoresValidation,
  addCommentValidation
} = require("../validators/scoresValidator");
const { addStudent } = require("./studentController");



const addTermComment = async (req, res, next) => {
  const { admNo, sessionName, termName } = req.query;
  const { ameedComment  } = req.body;

  const isStudent = await Student.findOne({ admNo })
  // check whether student exists in the scores database. if not, return error message
  if (!isStudent) {
    return next(new Error("Error: no such student found"));
  }
  const alreadyHasScores = await Score.findOne({ studentId: isStudent._id })

  if (!alreadyHasScores) throw new NotFoundError("Error: no scores registered for this student");
  else { // if yes, return all for the student in the session and year queried
    let result = alreadyHasScores.scores
    for (let count = 0; count < result.length; count++) {
      if (sessionName == result[count].sessionName) {
        //check for term
        for (let termcount = 0; termcount < result[count].term.length; termcount++) {
          if (termName == result[count].term[termcount].termName) {
            result[count].term[termcount].ameedComment = ameedComment  
            alreadyHasScores.save()  
          }
        }
      }
    }
  }
  res.status(201).json({ status: "success", message: "Comment added successfully" });
}


const addScores = async (req, res, next) => {
  // const { error } = addScoresValidation(req.body);
  // if (error) throw error;
  const { admNo } = req.query

  // check whether details match any student of the school
  const isStudent = await Student.findOne({ admNo });
  if (!isStudent) {
    throw new BadUserRequestError("Error: No student with this admission number exists");
  }
  // check whether student exists in the scores database, if not, add their data
  const alreadyHasScores = await Score.findOne({ admissionNumber: admNo })
  if (!alreadyHasScores) {
    const addStudent = await Score.create({ ...req.body, studentId: isStudent._id, admissionNumber: isStudent.admNo, student_name: isStudent.firstName + " " + isStudent.lastName, programme: isStudent.programme });
    // calculate total and average percentage
    req.body.term.grandTotal = req.body.term.subjects.length * 100;
    console.log("stage1 passed")
    req.body.term.marksObtained = req.body.term.subjects.reduce((accumulator, score) => {
      return accumulator += (+score.totalScore);
    }, 0)
    console.log("stage2 passed")
    req.body.term.avgPercentage = (req.body.term.marksObtained / req.body.term.grandTotal) * 100
    console.log("stage3passed", req.body.term.avgPercentage)

    addStudent.scores.push(req.body)
    addStudent.save()

    return res.status(201).json({ status: "success", addStudent, message: `${req.body.term.termName} term scores have been added for ${isStudent.firstName} ${isStudent.lastName}` });
  }
  // for existing session and term
  else {
    //check whether student has the subject's scores for the session and term specified
    let termName = req.body.term.termName;
    let sessionName = req.body.sessionName;
    for (let scorescount = 0; scorescount < alreadyHasScores.scores.length; scorescount++) {
      if (sessionName == alreadyHasScores.scores[scorescount].sessionName) {
        for (let termcount = 0; termcount < alreadyHasScores.scores[scorescount].term.length; termcount++) {
          if (alreadyHasScores.scores[scorescount].term[termcount].termName == termName && alreadyHasScores.scores[scorescount].term[termcount].subjects.length != 0) {
            throw new BadUserRequestError("Error: Student already has scores for the requested term");
          }
          // for non-existing scores in a term
          else if (alreadyHasScores.scores[scorescount].term[termcount].termName == termName && alreadyHasScores.scores[scorescount].term[termcount].subjects.length == 0) {
            console.log("match seen here")
            //if not third term
            if (req.body.term.termName != 'third') {
              req.body.term.grandTotal = req.body.term.subjects.length * 100;
              console.log("stage1 passed", req.body.term.grandTotal)
              req.body.term.marksObtained = req.body.term.subjects.reduce((accumulator, score) => {
                return accumulator += (+score.totalScore);
              }, 0)
              console.log("stage2 passed", req.body.term.marksObtained)
              req.body.term.avgPercentage = (req.body.term.marksObtained / req.body.term.grandTotal) * 100
              console.log("stage3passed", req.body.term.avgPercentage)
            }
            else {   //if third term
              let noOfTerms = 1;
              let firstTermScore = [];
              let secondTermScore = [];

              const firstTerm = alreadyHasScores.scores[scorescount].term.find(aterm => aterm.termName == "first")
              const secondTerm = alreadyHasScores.scores[scorescount].term.find(aterm => aterm.termName == "second")

              for (let subjectcount = 0; subjectcount < req.body.term.subjects.length; subjectcount++) {

                if (firstTerm != undefined) {
                  let matchSubject1st = firstTerm.subjects.find(asubject => asubject.subjectName == `${req.body.term.subjects[subjectcount].subjectName}`)
                  firstTermScore[0] = matchSubject1st.totalScore
                }
                else firstTermScore[0] = 0;

                if (secondTerm != undefined) {
                  let matchSubject2nd = secondTerm.subjects.find(asubject => asubject.subjectName == `${req.body.term.subjects[subjectcount].subjectName}`)
                  secondTermScore[0] = matchSubject2nd.totalScore
                }
                else secondTermScore[0] = 0

                console.log(firstTermScore[0])
                console.log(secondTermScore[0])
                if ((firstTermScore[0] != 0 && secondTermScore[0] == 0) || (secondTermScore[0] == 0 && firstTermScore[0] != 0)) noOfTerms = 2
                else if (firstTermScore[0] != 0 && secondTermScore[0] != 0) noOfTerms = 3
                console.log("number of terms ", noOfTerms)

                req.body.term.subjects[subjectcount].cumulativeScore = +req.body.term.subjects[subjectcount].totalScore + (+firstTermScore[0]) + (+secondTermScore[0]);
                req.body.term.subjects[subjectcount].cumulativeAverage = +req.body.term.subjects[subjectcount].cumulativeScore / noOfTerms;

                console.log(req.body.term.subjects[subjectcount].cumulativeScore)
                console.log(req.body.term.subjects[subjectcount].cumulativeAverage)
              }

              req.body.term.grandTotal = req.body.term.subjects.length * 100;
              console.log("stage1 passed", req.body.term.grandTotal)
              req.body.term.marksObtained = req.body.term.subjects.reduce((accumulator, subject) => {
                return accumulator += (+subject.cumulativeAverage);
              }, 0)
              console.log("stage2 passed", req.body.term.marksObtained)
              req.body.term.avgPercentage = (req.body.term.marksObtained / req.body.term.grandTotal) * 100
              console.log("stage3passed", req.body.term.avgPercentage)
            }

            alreadyHasScores.scores[scorescount].term[termcount].subjects = [...req.body.term.subjects]
            alreadyHasScores.scores[scorescount].term[termcount].comment = req.body.term.comment
            alreadyHasScores.scores[scorescount].term[termcount].grandTotal = req.body.term.grandTotal
            alreadyHasScores.scores[scorescount].term[termcount].marksObtained = req.body.term.marksObtained
            alreadyHasScores.scores[scorescount].term[termcount].avgPercentage = req.body.term.avgPercentage
            alreadyHasScores.save()
            return res.status(201).json({ status: "Success", alreadyHasScores, message: `${req.body.term.termName} term scores added successfully for the student` });
          }
        }
        // for non-existing term
        console.log("match seen here for non-existing term")
        //if not third term
        if (req.body.term.termName != 'third') {
          req.body.term.grandTotal = req.body.term.subjects.length * 100;
          console.log("stage1 passed", req.body.term.grandTotal)
          req.body.term.marksObtained = req.body.term.subjects.reduce((accumulator, score) => {
            return accumulator += (+score.totalScore);
          }, 0)
          console.log("stage2 passed", req.body.term.marksObtained)
          req.body.term.avgPercentage = (req.body.term.marksObtained / req.body.term.grandTotal) * 100
          console.log("stage3passed", req.body.term.avgPercentage)
        }
        else {   //if third term
          let noOfTerms = 1;
          let firstTermScore = [];
          let secondTermScore = [];

          const firstTerm = alreadyHasScores.scores[scorescount].term.find(aterm => aterm.termName == "first")
          const secondTerm = alreadyHasScores.scores[scorescount].term.find(aterm => aterm.termName == "second")

          for (let subjectcount = 0; subjectcount < req.body.term.subjects.length; subjectcount++) {

            if (firstTerm != undefined) {
              let matchSubject1st = firstTerm.subjects.find(asubject => asubject.subjectName == `${req.body.term.subjects[subjectcount].subjectName}`)
              firstTermScore[0] = matchSubject1st.totalScore
            }
            else firstTermScore[0] = 0;

            if (secondTerm != undefined) {
              let matchSubject2nd = secondTerm.subjects.find(asubject => asubject.subjectName == `${req.body.term.subjects[subjectcount].subjectName}`)
              secondTermScore[0] = matchSubject2nd.totalScore
            }
            else secondTermScore[0] = 0

            console.log(firstTermScore[0])
            console.log(secondTermScore[0])
            if ((firstTermScore[0] != 0 && secondTermScore[0] == 0) || (secondTermScore[0] == 0 && firstTermScore[0] != 0)) noOfTerms = 2
            else if (firstTermScore[0] != 0 && secondTermScore[0] != 0) noOfTerms = 3
            console.log("number of terms ", noOfTerms)

            req.body.term.subjects[subjectcount].cumulativeScore = +req.body.term.subjects[subjectcount].totalScore + (+firstTermScore[0]) + (+secondTermScore[0]);
            req.body.term.subjects[subjectcount].cumulativeAverage = +req.body.term.subjects[subjectcount].cumulativeScore / noOfTerms;

            console.log(req.body.term.subjects[subjectcount].cumulativeScore)
            console.log(req.body.term.subjects[subjectcount].cumulativeAverage)
          }

          req.body.term.grandTotal = req.body.term.subjects.length * 100;
          console.log("stage1 passed", req.body.term.grandTotal)
          req.body.term.marksObtained = req.body.term.subjects.reduce((accumulator, subject) => {
            return accumulator += (+subject.cumulativeAverage);
          }, 0)
          console.log("stage2 passed", req.body.term.marksObtained)
          req.body.term.avgPercentage = (req.body.term.marksObtained / req.body.term.grandTotal) * 100
          console.log("stage3passed", req.body.term.avgPercentage)
        }

        alreadyHasScores.scores[scorescount].term.push(req.body.term)
        alreadyHasScores.save()
        return res.status(201).json({ status: "Success", alreadyHasScores, message: `${req.body.term.termName} term scores added successfully for the student` });
      }
    }  // for non-existing session
    // else if (sessionName != alreadyHasScores.scores[scorescount].sessionName) {
    console.log("match seen here here")
    req.body.term.grandTotal = req.body.term.subjects.length * 100;
    console.log("stage1 passed")
    req.body.term.marksObtained = req.body.term.subjects.reduce((accumulator, score) => {
      return accumulator += (+score.totalScore);
    }, 0)
    console.log("stage2 passed", typeof req.body.term.marksObtained)
    req.body.term.avgPercentage = (req.body.term.marksObtained / req.body.term.grandTotal) * 100
    console.log("stage3passed", req.body.term.avgPercentage)
    alreadyHasScores.scores.push(req.body)
    alreadyHasScores.save()

    return res.status(201).json({ status: "Success", alreadyHasScores, message: `${req.body.sessionName} ${req.body.term.termName} term scores for this student added successfully` });
    // }

  }
}


const getScores = async (req, res, next) => {

  const { admNo, termName, sessionName } = req.query;

  const isStudent = await Student.findOne({ admNo })

  // check whether student exists in the scores database
  //if not, return error message
  if (!isStudent) {
    return next(new Error("Error: no such student found"));
  }
  if (req.user.role == "parent") {
   if(req.user.email != isStudent.parentEmail)
    throw new BadUserRequestError("Error: you do not have access to this result. Input your ward's admission number");
  }
  if (req.user.other_role == "parent") {
    const isSameClass = await Staff.findOne({email : req.user.email})
   if(isSameClass.teacherClass != isStudent.presentClass && req.user.email != isStudent.parentEmail)
    throw new BadUserRequestError("Error: you do not have access to this result. You're only able to view the results of your ward(s) or your students");
  }
  if (req.user.role == "student") {
    const isValidStudent = await Student.findOne({email : req.user.email})
   if(admNo != isValidStudent.admNo)
    throw new BadUserRequestError("Error: you do not have access to this result. Input your admission number.");
  }
  const alreadyHasScores = await Score.findOne({ studentId: isStudent._id })

  if (!alreadyHasScores) throw new NotFoundError("Error: no scores registered for this student");
  else { // if yes, return all registerd scores for the student in the session and year queried
    let result = alreadyHasScores.scores
    for (let count = 0; count < result.length; count++) {
      if (sessionName == result[count].sessionName) {
        let className = result[count].className
        //check for the class details
        let classmatch = await sClass.findOne({className})
        let noInClass = classmatch.noInClass
        let teacherSignature = classmatch.teacherSignature
        //check for term scores
        for (let termcount = 0; termcount < result[count].term.length; termcount++) {
          if (termName == result[count].term[termcount].termName) {
            let firstTermScore = []
            let secondTermScore = []
            let attendance = result[count].term[termcount].attendance
            let comment = result[count].term[termcount].comment
            let ameedComment = result[count].term[termcount].ameedComment
            let grandTotal = result[count].term[termcount].grandTotal
            let marksObtained = result[count].term[termcount].marksObtained
            let avgPercentage = result[count].term[termcount].avgPercentage
            let report = result[count].term[termcount].subjects

            if (termName == 'third') {
              const firstTerm = result[count].term.find(aterm => aterm.termName == "first")
              const secondTerm = result[count].term.find(aterm => aterm.termName == "second")
              for (let subjectcount = 0; subjectcount < result[count].term[termcount].subjects.length; subjectcount++) {

                if (firstTerm) {
                  let matchSubject1st = firstTerm.subjects.find(asubject => asubject.subjectName == result[count].term[termcount].subjects[subjectcount].subjectName)
                  firstTermScore[subjectcount] = matchSubject1st.totalScore
                }
                else firstTermScore[subjectcount] = 0;

                if (secondTerm) {
                  let matchSubject2nd = secondTerm.subjects.find(asubject => asubject.subjectName == result[count].term[termcount].subjects[subjectcount].subjectName)
                  secondTermScore[subjectcount] = matchSubject2nd.totalScore
                }
                else secondTermScore[subjectcount] = 0
              }
            }
            let reportcarddetails = await CardDetails.findOne({})
            let maxAttendance = reportcarddetails.maxAttendance
            let nextTermDate = reportcarddetails.nextTermDate
            let principalSign = reportcarddetails.principalSignature
            let proprietorSign = reportcarddetails.proprietorSignature
            return res.status(200).json({ status: "success", message: `${alreadyHasScores.student_name}`, termName, className, sessionName, report, comment, grandTotal, marksObtained, avgPercentage, 
              firstTermScore, secondTermScore, attendance, maxAttendance, noInClass, ameedComment, teacherSignature, principalSign, proprietorSign, nextTermDate });
          }
        }
      }
    }
  }
  throw new NotFoundError("Error: no scores found for the term specified")
}

const getTermlyScores = async (req, res, next) => {

  const { admNo, sessionName } = req.query;

  const isStudent = await Student.findOne({ admNo })

  // check whether student exists in the scores database
  //if not, return error message
  if (!isStudent) {
    return next(new Error("Error: no such student found"));
  }
  if ((req.user.role == "parent" && req.user.email != isStudent.parentEmail) || (req.user.other_role == "parent" && req.user.role == 'teacher' && req.user.email != isStudent.parentEmail)) {
    throw new BadUserRequestError("Error: you do not have access to this result. Input your ward's admission number");
  }
  const alreadyHasScores = await Score.findOne({ studentId: isStudent._id })

  if (!alreadyHasScores) throw new NotFoundError("Error: no scores registered for this student");
  else { // if yes, return all registerd scores for the student in the session queried
    let result = alreadyHasScores.scores
    for (let count = 0; count < result.length; count++) {
      if (sessionName == result[count].sessionName) {
        let report = result[count].term
        return res.status(200).json({ status: "success", message: `${alreadyHasScores.student_name}`, report });
      }
    }
  }
  throw new NotFoundError("Error: no scores found for the session specified")
}

const getScoresBySession = async (req, res, next) => {

  const { admNo } = req.query;

  const isStudent = await Student.findOne({ admNo })

  // check whether student exists in the scores database
  //if not, return error message
  if (!isStudent) {
    return next(new Error("Error: no such student found"));
  }
  if ((req.user.role == "parent" && req.user.email != isStudent.parentEmail) || (req.user.other_role == "parent" && req.user.role == 'teacher' && req.user.email != isStudent.parentEmail)) {
    throw new BadUserRequestError("Error: you do not have access to this result. Input your ward's admission number");
  }
  const alreadyHasScores = await Score.findOne({ studentId: isStudent._id })

  if (!alreadyHasScores) throw new NotFoundError("Error: no scores registered for this student");
  else { // if yes, return all registerd scores for the student in the session queried
    let result = alreadyHasScores.scores
    return res.status(200).json({ status: "success", message: `${alreadyHasScores.student_name}`, result });
  }
}


const getClassScores = async (req, res, next) => {

  const { className, termName, sessionName, programme } = req.query;

  const classExists = await Score.find(
    {
      $and:
        [
          { programme: programme },
          { "scores.className": className },
          { "scores.sessionName": sessionName },
          { "scores.term.termName": termName },
        ]
    })

  if (classExists.length == 0) throw new NotFoundError("Error: this class has no registered scores for the term/session specified");

  const classRequest = await sClass.findOne({
    $and:
      [
        { className },
        { programme }
      ]
  })
  if (!classRequest) throw new NotFoundError("Error: the requested class does not exist");
  const classSubjects = classRequest.subjects

  res.status(200).json({ status: "success", message: "successful", classExists, classSubjects });
}


const promoteStudents = async (req, res, next) => {
  const scores = await Score.find({});
  if (!scores) {
    return next(new Error("Error: no scores recorded"));
  }
  const passed = scores.
    res.status(200).json({ status: "success", scores, message: "scores returned successfully!" });
};


const updateScores = async (req, res, next) => {
  const { admNo } = req.query
  // console.log(req.body)

  // check whether details match any student of the school
  const isStudent = await Student.findOne({ admNo });
  if (!isStudent) {
    throw new BadUserRequestError("Error: No student with this admission number exists");
  }
  // check whether student exists in the scores database, if not, add their data
  const alreadyHasScores = await Score.findOne({ admissionNumber: admNo })
  console.log(alreadyHasScores)
  if (!alreadyHasScores) {
    throw new NotFoundError("Error: No scores have been registered for this student");
  }
  else {// if yes, check whether student has the subject's scores for the session and term specified, update scores as appropriate
    const sessionName = req.body.sessionName;
    const termName = req.body.term.termName;
    for (let scorescount = 0; scorescount < alreadyHasScores.scores.length; scorescount++) {
      console.log("alreadyHasScores.scores[scorescount].sessionName is", alreadyHasScores.scores[scorescount].sessionName)
      if (sessionName == alreadyHasScores.scores[scorescount].sessionName) {
        for (let termcount = 0; termcount < alreadyHasScores.scores[scorescount].term.length; termcount++) {
          if (alreadyHasScores.scores[scorescount].term[termcount].termName == termName) {
            console.log(alreadyHasScores.scores[scorescount].term[termcount].termName)
            console.log(termName)
            for (let subjectcount = 0; subjectcount < alreadyHasScores.scores[scorescount].term[termcount].subjects.length; subjectcount++) {
              if (req.body.term.subjects.subjectName == alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].subjectName) {
                console.log("match seen")
                req.body.term.subjects.totalScore = +req.body.term.subjects.testScore + +req.body.term.subjects.examScore;
                alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].testScore = +req.body.term.subjects.testScore;
                alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].examScore = +req.body.term.subjects.examScore;
                alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].totalScore = +req.body.term.subjects.totalScore;
                alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].remark = req.body.term.subjects.remark;
                if (req.body.term.comment != "") {
                  alreadyHasScores.scores[scorescount].term[termcount].comment = req.body.term.comment
                }
                //adjust cumulative scores
                //if not third term
                if (req.body.term.termName != 'third') {
                  alreadyHasScores.scores[scorescount].term[termcount].grandTotal = alreadyHasScores.scores[scorescount].term[termcount].subjects.length * 100;
                  console.log("stage1 passed", typeof alreadyHasScores.scores[scorescount].term[termcount].grandTotal)
                  alreadyHasScores.scores[scorescount].term[termcount].marksObtained = alreadyHasScores.scores[scorescount].term[termcount].subjects.reduce((accumulator, score) => {
                    return accumulator += (+score.totalScore);
                  }, 0)
                  console.log("stage2 passed", typeof alreadyHasScores.scores[scorescount].term[termcount].marksObtained)
                  alreadyHasScores.scores[scorescount].term[termcount].avgPercentage = (alreadyHasScores.scores[scorescount].term[termcount].marksObtained / alreadyHasScores.scores[scorescount].term[termcount].grandTotal) * 100
                  console.log("stage3passed", alreadyHasScores.scores[scorescount].term[termcount].avgPercentage)
                }
                else {   //if third term
                  let noOfTerms = 1;
                  let firstTermScore = [];
                  let secondTermScore = [];

                  const firstTerm = alreadyHasScores.scores[scorescount].term.find(aterm => aterm.termName == "first")
                  const secondTerm = alreadyHasScores.scores[scorescount].term.find(aterm => aterm.termName == "second")

                  if (firstTerm != undefined) {
                    let matchSubject1st = firstTerm.subjects.find(asubject => asubject.subjectName == `${req.body.term.subjects.subjectName}`)
                    firstTermScore[0] = matchSubject1st.totalScore
                  }
                  else firstTermScore[0] = 0;

                  if (secondTerm != undefined) {
                    let matchSubject2nd = secondTerm.subjects.find(asubject => asubject.subjectName == `${req.body.term.subjects.subjectName}`)
                    secondTermScore[0] = matchSubject2nd.totalScore
                  }
                  else secondTermScore[0] = 0

                  console.log(firstTermScore[0])
                  console.log(secondTermScore[0])
                  if ((firstTermScore[0] != 0 && secondTermScore[0] == 0) || (secondTermScore[0] == 0 && firstTermScore[0] != 0)) noOfTerms = 2
                  else if (firstTermScore[0] != 0 && secondTermScore[0] != 0) noOfTerms = 3
                  console.log("number of terms ", noOfTerms)


                  alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].cumulativeScore = +req.body.term.subjects.totalScore + (+firstTermScore[0]) + (+secondTermScore[0]);
                  alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].cumulativeAverage = +alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].cumulativeScore / noOfTerms;

                  console.log(alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].cumulativeScore)
                  console.log(alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].cumulativeAverage)


                  alreadyHasScores.scores[scorescount].term[termcount].grandTotal = alreadyHasScores.scores[scorescount].term[termcount].subjects.length * 100;
                  console.log("stage1 passed", typeof alreadyHasScores.scores[scorescount].term[termcount].grandTotal)
                  alreadyHasScores.scores[scorescount].term[termcount].marksObtained = alreadyHasScores.scores[scorescount].term[termcount].subjects.reduce((accumulator, score) => {
                    return accumulator += (+score.totalScore);
                  }, 0)
                  console.log("stage2 passed", typeof alreadyHasScores.scores[scorescount].term[termcount].marksObtained)
                  alreadyHasScores.scores[scorescount].term[termcount].avgPercentage = (alreadyHasScores.scores[scorescount].term[termcount].marksObtained / alreadyHasScores.scores[scorescount].term[termcount].grandTotal) * 100
                  console.log("stage3passed", alreadyHasScores.scores[scorescount].term[termcount].avgPercentage)
                }

                alreadyHasScores.save();
                return res.status(200).json({ status: "Success", alreadyHasScores, message: `${req.body.term.subjects.subjectName} scores updated successfully` });
              }
            }
          }
        }
      }
    }
    throw new BadUserRequestError("Error: Student does not have scores for this session");;
  }
}


const markAttendance = async (req, res, next) => {
  const { className, termName, sessionName, programme } = req.query;

  const classExists = await Score.find(
    {
      $and:
        [
          { programme: programme },
          { "scores.className": className },
          { "scores.sessionName": sessionName },
          { "scores.term.termName": termName },
        ]
    })
  console.log(classExists)
  if (classExists.length == 0) {
    for (let count = 0; count < req.body.length; count++) {
      const studentname = req.body[count].student_name.split(" ");
      let firstName = studentname[0];
      let lastName = studentname[1];
      // console.log(firstName, lastName)
      const student = await Student.findOne({
        $and:
          [
            { firstName },
            { lastName }
          ]
      })
      const addStudent = await Score.create({ studentId: student._id, admissionNumber: student.admNo, student_name: student.firstName + " " + student.lastName, programme: student.programme });
      let dayattendance = {
        termdate: req.body[count].termdate,
        presence: req.body[count].presence,
      }
      let timeOfYear = {
        sessionName,
        className,
        term: {
          termName,
          attendance: dayattendance
        }

      }
      addStudent.scores.push(timeOfYear)
      addStudent.save()
      console.log(addStudent)
    }
  }
  else {
    for (let stdcount = 0; stdcount < classExists.length; stdcount++) {
      for (let count = 0; count < req.body.length; count++) {
        if (req.body[count].student_name == classExists[stdcount].student_name) {
          console.log("match seen name")
          for (let scorescount = 0; scorescount < classExists[stdcount].scores.length; scorescount++) {
            const sessionMatch = classExists[stdcount].scores.find(asession => asession.sessionName == sessionName)
            if (!sessionMatch) throw new BadUserRequestError("Error: the student doesn't have a record for the session specified");
            else {
              console.log("match seen session")
              const termMatch = classExists[stdcount].scores[scorescount].term.find(aterm => aterm.termName == termName)
              if (!termMatch) throw new BadUserRequestError("Error: the student doesn't have a record for the term specified");
              else {
                console.log("match seen term")
                let dayattendance = {
                  termdate: req.body[count].termdate,
                  presence: req.body[count].presence,
                }
                termMatch.attendance.push(dayattendance)

                classExists[stdcount].save();
              }
            }
          }
        }
      }
    }
  }
  return res.status(200).json({ status: "Success", classExists, message: `attendance updated successfully` });
}



module.exports = { addScores, getScores, getTermlyScores, getScoresBySession, getClassScores, promoteStudents, updateScores, addTermComment, markAttendance }


