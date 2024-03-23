const dbDebugger = require("debug")("app:db");
const Student = require("../models/studentModel");
const Score = require("../models/scoreModel");
const {
  addScoresValidation
} = require("../validators/scoresValidator");
const { addStudent } = require("./studentController");


const addScores = async (req, res, next) => {
  const { error } = addScoresValidation(req.body);
  if (error) throw error;

  const { admNo, firstName, lastName } = req.query;

  // check whether details match any student of the school
  const isStudent = await Student.findOne({
    $and: [{ admNo }, { firstName }, { lastName }]
  })
    .select("admNo firstName lastName");
  if (!isStudent) {
    return next(new Error("Error: no such student found"));
  }
  dbDebugger(isStudent._id)

  // check whether student exists in the scores database
  //if not, create a document for the student and push scores
  const alreadyHasScores = await Score.findOne({ studentId: isStudent._id })
  if (!alreadyHasScores) {
    const addStudent = await Score.create({ ...req.body, studentId: isStudent._id, AdmissionNumber: isStudent.admNo, Name: isStudent.firstName + " " + isStudent.lastName });
    addStudent.scores.push(req.body)
    addStudent.save()
    res.status(201).json({ status: "success", addStudent, msg: "student created and scores added successfully" });
  }
  else {// if yes, check whether student has scores for the session and term specified, display error if there is
    for (let count = 0; count < alreadyHasScores.scores.length; count++) {
      if (req.body.session === alreadyHasScores.scores[count].session && req.body.term === alreadyHasScores.scores[count].term) {
        dbDebugger("found ")
        return next(new Error("Error: scores for this term already exists for the student"));
      }
    }
    // if not, push the scores into the array of student's scores
    alreadyHasScores.scores.push(req.body)
    alreadyHasScores.save()
    res.status(201).json({ status: "success", msg: "scores for this student added successfully" });
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




module.exports = { addScores,getScores, promoteStudents }


