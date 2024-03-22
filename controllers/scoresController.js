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

  const isStudent = await Student.findOne({
    $and: [{ admNo }, { firstName }, { lastName }]
  })
    .select("admNo firstName lastName");
  if (!isStudent) {
    return next(new Error("Error: no such student found"));
  }
  dbDebugger(isStudent._id)

  const alreadyHasScores = await Score.findOne({studentId:isStudent._id})
  if (!alreadyHasScores) { 
    const addStudent = await Score.create({ ...req.body, studentId: isStudent._id, AdmissionNumber:isStudent.admNo, Name:isStudent.firstName +" "+isStudent.lastName});
    addStudent.scores.push(req.body)
    addStudent.save()
    res.status(201).json({ addStudent, msg: "student created and scores added successfully" });
}
  else { 
    for (let count =0; count<alreadyHasScores.scores.length; count++)  {
      if (req.body.session === alreadyHasScores.scores[count].session && req.body.term === alreadyHasScores.scores[count].term){ 
        dbDebugger("found ")
        return next(new Error("Error: scores for this term already exists for the student"));
     }
    }
   
    const inputScore = alreadyHasScores.scores.push(req.body)
    alreadyHasScores.save()
    res.status(201).json({ inputScore, msg: "scores for this student added successfully" });
   }
  }


const promoteStudents = async (req, res, next) => {
  const scores = await Score.find({});
  if (!scores) {
    return next(new Error("Error: no scores recorded"));
  }
  const passed = scores.
    res.status(200).json({ scores, msg: "scores returned successfully!" });
};




module.exports = { addScores, promoteStudents }


