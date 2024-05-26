// const dbDebugger = require("debug")("app:db");
const Student = require("../models/studentModel");
const Score = require("../models/scoreModel");
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

  const { admNo} = req.query;
  const {comment, sessionName, className, termName } = req.body

  // check whether details match any student of the school
  const isStudent = await Student.findOne({ admNo });
  if (!isStudent) {
    throw new BadUserRequestError("Error: No student with this admission number exists");
  }
 const toaddcomment = await Score.findOne({admissionNumber:admNo})
  if (!toaddcomment) throw new NotFoundError("Error: Student not found!");

  for(let count = 0; count < toaddcomment.scores.length; count++){
    if (toaddcomment.scores[count].sessionName == sessionName && toaddcomment.scores[count].className == className){
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

  // check whether student exists in the scores database
  //if not, alert an error
  const alreadyHasScores = await Score.findOne({ studentId: isStudent._id })
  // if (!alreadyHasScores) {
  //   throw new BadUserRequestError("Error: Student has not been added, use the 'Add Student' button to add them");
  // }
  if (!alreadyHasScores) {
    const addStudent = await Score.create({ ...req.body, studentId: isStudent._id, admissionNumber: isStudent.admNo, student_name: isStudent.firstName + " " + isStudent.lastName });
    addStudent.scores.push(req.body)
    addStudent.save()

   return res.status(201).json({ status: "success", addStudent, message: "Student created successfully." });
  }
  else {// if yes, check whether student has the subject's scores for the session and term specified, add scores as appropriate
    const { sessionName, className} = req.body;
    let termName = req.body.term.termName;
    for (let scorescount = 0; scorescount < alreadyHasScores.scores.length; scorescount++) {
     
      if (sessionName == alreadyHasScores.scores[scorescount].sessionName && className == alreadyHasScores.scores[scorescount].className) {
        for (let termcount = 0; termcount < alreadyHasScores.scores[scorescount].term.length; termcount++) {
          if (alreadyHasScores.scores[scorescount].term[termcount].termName == termName) {
            for (let subjectcount = 0; subjectcount < alreadyHasScores.scores[scorescount].term[termcount].subjects.length; subjectcount++) {
              if (req.body.term.subjects.subjectName == alreadyHasScores.scores[scorescount].term[termcount].subjects[subjectcount].subjectName) {
                console.log("match seen")
                throw new BadUserRequestError(`Error: ${isStudent.firstName} ${isStudent.lastName} already has scores for ${req.body.term.subjects.subjectName}`);
              }
            }
            req.body.term.subjects.totalScore = req.body.term.subjects.testScore + req.body.term.subjects.examScore;
            alreadyHasScores.scores[scorescount].term[termcount].subjects.push(req.body.term.subjects)
            alreadyHasScores.save() 
            return res.status(201).json({ status: "success", alreadyHasScores, message: "Subject added successfully." });
          }
          else if (termName != alreadyHasScores.scores[scorescount].term[termcount].termName) {
            console.log("match seen here")
            req.body.term.subjects.totalScore = req.body.term.subjects.testScore + req.body.term.subjects.examScore;
            alreadyHasScores.scores[scorescount].term.push(req.body.term)
            alreadyHasScores.save()
            return res.status(201).json({ status: "success", alreadyHasScores, message: "Subject added successfully for the term." });
          }
        }
        }
      else if (sessionName != alreadyHasScores.scores[scorescount].sessionName && className != alreadyHasScores.scores[scorescount].className) {
        console.log("match seen here here")
        req.body.term.subjects.totalScore = req.body.term.subjects.testScore + req.body.term.subjects.examScore;
        alreadyHasScores.scores.push(req.body)
        alreadyHasScores.save()
        return res.status(201).json({ status: "Success", alreadyHasScores, message: `${req.body.term.subjects.subjectName} scores for this student added successfully` });
      }
    
  }
}

}



const getScores = async (req, res, next) => {
  const { admNo, firstName, lastName } = req.query;
  // check whether details match any student of the school
  const isStudent = await Student.findOne({
    $and: [{ admNo }, { firstName }, { lastName }]
  })
  if (!isStudent) {
    return next(new Error("Error: no such student found"));
  }
  dbDebugger(isStudent._id)
  // check whether student exists in the scores database
  //if not, return error message
  const alreadyHasScores = await Score.findOne({ studentId: isStudent._id })
  if (!alreadyHasScores) { return next(new Error("Error: no scores registered for this student")); }
  else { // if yes, return all registerd scores for the student
    const result = alreadyHasScores.scores
    res.status(200).json({ status: "success", msg: `student has scores registered for ${result.length} terms`, result });
  }

}


const promoteStudents = async (req, res, next) => {
  const scores = await Score.find({});
  if (!scores) {
    return next(new Error("Error: no scores recorded"));
  }
  const passed = scores.
    res.status(200).json({ status: "success", scores, msg: "scores returned successfully!" });
};




module.exports = { addScores, getScores, promoteStudents, addTermComment }


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

