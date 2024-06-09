// const dbDebugger = require("debug")("app:db");
const Student = require("../models/studentModel");
const Score = require("../models/scoreModel");
const sClass = require("../models/classModel");
const { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } =
  require('../middleware/errors')
const {
  addScoresValidation,
  addCommentValidation
} = require("../validators/scoresValidator");
const { addStudent } = require("./studentController");



const addTermComment = async (req, res, next) => {
  const { error } = addCommentValidation(req.body);
  if (error) throw error;

  const { admNo } = req.query;
  const { comment, sessionName, className, termName } = req.body

  // check whether details match any student of the school
  const isStudent = await Student.findOne({ admNo });
  if (!isStudent) {
    throw new BadUserRequestError("Error: No student with this admission number exists");
  }
  const toaddcomment = await Score.findOne({ admissionNumber: admNo })
  if (!toaddcomment) throw new NotFoundError("Error: Student not found!");

  for (let count = 0; count < toaddcomment.scores.length; count++) {
    if (toaddcomment.scores[count].sessionName == sessionName && toaddcomment.scores[count].className == className) {
      for (let termcount = 0; termcount < toaddcomment.scores[count].term.length; termcount++) {
        if (toaddcomment.scores[count].term[termcount].termName == termName) {
          toaddcomment.scores[count].term[termcount].comment = comment
          toaddcomment.save()
        }
      }
    }
  }
  res.status(201).json({ status: "success", toaddcomment, message: "Comment added successfully" });
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
    console.log("stage1 passed", typeof req.body.term.grandTotal)
    req.body.term.marksObtained = req.body.term.subjects.reduce((accumulator, score) => {
      return accumulator += (+score.totalScore);
    }, 0)
    console.log("stage2 passed", typeof req.body.term.marksObtained)
    req.body.term.avgPercentage = (req.body.term.marksObtained / req.body.term.grandTotal) * 100
    console.log("stage3passed", req.body.term.avgPercentage)

    addStudent.scores.push(req.body)
    addStudent.save()

    return res.status(201).json({ status: "success", addStudent, message: `${req.body.term.termName} term scores have been added for ${isStudent.firstName} ${isStudent.lastName}` });
  }
  // for non-existing term in a session
  else {
    //check whether student has the subject's scores for the session and term specified
    let termName = req.body.term.termName;
    let sessionName = req.body.sessionName;
    for (let scorescount = 0; scorescount < alreadyHasScores.scores.length; scorescount++) {
      if (sessionName == alreadyHasScores.scores[scorescount].sessionName) {
        for (let termcount = 0; termcount < alreadyHasScores.scores[scorescount].term.length; termcount++) {
          if (alreadyHasScores.scores[scorescount].term[termcount].termName == termName) {
            throw new BadUserRequestError("Error: Student already has scores for the requested term");
          }
        }
        console.log("match seen here")
        console.log(termName)
        //if not third term
        if (req.body.term.termName != 'third') {
          req.body.term.grandTotal = req.body.term.subjects.length * 100;
          console.log("stage1 passed", typeof req.body.term.grandTotal)
          req.body.term.marksObtained = req.body.term.subjects.reduce((accumulator, score) => {
            return accumulator += (+score.totalScore);
          }, 0)
          console.log("stage2 passed", typeof req.body.term.marksObtained)
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
    console.log("stage1 passed", typeof req.body.term.grandTotal)
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
  const alreadyHasScores = await Score.findOne({ studentId: isStudent._id })

  if (!alreadyHasScores) throw new NotFoundError("Error: no scores registered for this student");
  else { // if yes, return all registerd scores for the student in the session and year queried
    let result = alreadyHasScores.scores
    for (let count = 0; count < result.length; count++) {
      if (sessionName == result[count].sessionName) {
        for (let termcount = 0; termcount < result[count].term.length; termcount++) {
          if (termName == result[count].term[termcount].termName) {
            let firstTermScore = []
            let secondTermScore = []
            comment = result[count].term[termcount].comment
            grandTotal = result[count].term[termcount].grandTotal
            marksObtained = result[count].term[termcount].marksObtained
            avgPercentage = result[count].term[termcount].avgPercentage
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
            return res.status(200).json({ status: "success", message: `${alreadyHasScores.student_name}`, termName, report, comment, grandTotal, marksObtained, avgPercentage, firstTermScore, secondTermScore });
          }
        }
      }
    }
  }
  throw new NotFoundError("Error: no scores found for the term specified")
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
  if (classExists.length == 0) throw new NotFoundError("Error: this class has no registered scores for the session specified");
  
  const classRequest = await sClass.findOne({className})
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
    res.status(200).json({ status: "success", scores, msg: "scores returned successfully!" });
};

const updateScores = async (req, res, next) => {
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
    const addStudent = await Score.create({ ...req.body, studentId: isStudent._id, admissionNumber: isStudent.admNo, student_name: isStudent.firstName + " " + isStudent.lastName });
    addStudent.scores.push(req.body)
    addStudent.save()

    return res.status(201).json({ status: "success", addStudent, message: `${req.body.term.termName} scores have been added for ${isStudent.firstName} ${isStudent.lastName}` });
  }
  else {// if yes, check whether student has the subject's scores for the session and term specified, add scores as appropriate
    const { sessionName, className } = req.body;
    let termName = req.body.term.termName;
    for (let scorescount = 0; scorescount < alreadyHasScores.scores.length; scorescount++) {

      if (sessionName == alreadyHasScores.scores[scorescount].sessionName) {
        for (let termcount = 0; termcount < alreadyHasScores.scores[scorescount].term.length; termcount++) {
          if (alreadyHasScores.scores[scorescount].term[termcount].termName == termName) {
            for (let subjectcount = 0; subjectcount < alreadyHasScores.scores[scorescount].term[termcount].subjects.length; subjectcount++) {
              if (req.body.term.subjects.subjectName == alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].subjectName) {
                console.log("match seen")
                console.log(alreadyHasScores.scores[scorescount].term[termcount].termName)
                console.log(termName)
                throw new BadUserRequestError(`Error: ${isStudent.firstName} ${isStudent.lastName} already has scores for ${req.body.term.subjects.subjectName}`);
              }
            }
            // if no subject clashes are found in a term
            req.body.term.subjects.totalScore = +req.body.term.subjects.testScore + +req.body.term.subjects.examScore;
            alreadyHasScores.scores[scorescount].term[termcount].subjects.push(req.body.term.subjects)
            alreadyHasScores.scores[scorescount].term[termcount].comment = req.body.term.comment
            alreadyHasScores.save()
            return res.status(201).json({ status: "success", alreadyHasScores, message: `Scores added successfully for ${isStudent.firstName} ${isStudent.lastName}` });
          }
        }
        // for non-existing term in a session
        console.log("match seen here")
        console.log(termName)
        req.body.term.subjects.totalScore = +req.body.term.subjects.testScore + +req.body.term.subjects.examScore;
        alreadyHasScores.scores[scorescount].term.push(req.body.term)
        alreadyHasScores.save()
        return res.status(201).json({ status: "success", alreadyHasScores, message: `${req.body.term.subjects.subjectName} scores added successfully for the term` });

      }
      // for non-existing session
      else if (sessionName != alreadyHasScores.scores[scorescount].sessionName) {
        console.log("match seen here here")
        req.body.term.subjects.totalScore = +req.body.term.subjects.testScore + +req.body.term.subjects.examScore;
        alreadyHasScores.scores.push(req.body)
        alreadyHasScores.save()
        return res.status(201).json({ status: "Success", alreadyHasScores, message: `${req.body.term.subjects.subjectName} scores for this student added successfully` });
      }

    }
  }

}




module.exports = { addScores, getScores, getClassScores, promoteStudents, addTermComment }


// const addScores = async (req, res, next) => {
//   const { error } = addScoresValidation(req.body);
//   if (error) throw error;

//   const { admNo, firstName, lastName } = req.query;

//   // check whether details match any student of the school
//   const isStudent = await Student.findOne({
//     $and: [{ admNo }, { firstName }, { lastName }]
//   })
//     .select("admNo firstName lastName");
//   if (!isStudent) {
//     return next(new Error("Error: no such student found"));
//   }
//   dbDebugger(isStudent._id)

//   // check whether student exists in the scores database
//   //if not, create a document for the student and push scores
//   const alreadyHasScores = await Score.findOne({ studentId: isStudent._id })
//   if (!alreadyHasScores) {
//     const addStudent = await Score.create({ ...req.body, studentId: isStudent._id, AdmissionNumber: isStudent.admNo, Name: isStudent.firstName + " " + isStudent.lastName });
//     addStudent.scores.push(req.body)
//     addStudent.save()
//     res.status(201).json({ status: "success", addStudent, msg: "student created and scores added successfully" });
//   }
//   else {// if yes, check whether student has scores for the session and term specified, display error if there is
//     for (let count = 0; count < alreadyHasScores.scores.length; count++) {
//       if (req.body.session === alreadyHasScores.scores[count].session && req.body.term === alreadyHasScores.scores[count].term) {
//         dbDebugger("found ")
//         return next(new Error("Error: scores for this term already exists for the student"));
//       }
//     }
//     // if not, push the scores into the array of student's scores
//     alreadyHasScores.scores.push(req.body)
//     alreadyHasScores.save()
//     res.status(201).json({ status: "success", msg: "scores for this student added successfully" });
//   }
// }

