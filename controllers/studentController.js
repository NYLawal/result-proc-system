const dbDebugger = require("debug")("app:db");
const Student = require("../models/studentModel");
const {
  newStudentValidation,
  updateStudentValidation,
} = require("../validators/studentValidator");

const classes = require("../models/classModel");
// const asyncWrapper = require('../middleware/async')

const addStudent = async (req, res, next) => {
  const { error } = newStudentValidation(req.body);
  if (error) throw error;
  const student = await Student.create(req.body);
  res.status(201).json({ student, msg: "student added successfully" });
};

const getStudents = async (req, res, next) => {
  const pageNumber = req.params.page;
  const pageSize = 5;

  const { firstName, lastName, age, gender, address, status } = req.query;
  let queryObject = {};

  if (firstName) {
    queryObject.firstName = { $regex: firstName, $options: "i" };
  }
  if (lastName) {
    queryObject.lastName = { $regex: lastName, $options: "i" };
  }
  if (age) {
    queryObject.age = age;
  }
  if (gender) {
    queryObject.gender = gender;
  }
  if (address) {
    queryObject.address = { $regex: address, $options: "i" };
  }
  if (status) {
    queryObject.status = status;
  }
  if (Object.keys(queryObject).length === 0)
    return next(new Error("Error: no such criteria exists"));

  const students = await Student.find(queryObject)
    .sort({ firstName: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  if (students.length == 0)
    return next(new Error("Error: no such students found"));

  res
    .status(200)
    .json({ success: "true", students, noOfStudents: students.length });
};

const getOneStudent = async (req, res, next) => {
  const { admNo } = req.query;
  const student = await Student.findOne({ admNo });
  dbDebugger(student);
  if (!student) return next(new Error("Error: no such student found"));
  res.status(200).json({ success: "true", student, msg: "student found!" });
};

const getAllStudents = async (req, res, next) => {
  const pageNumber = req.params.page;
  const pageSize = 5;

  const students = await Student.find({})
    .sort({ firstName: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  if (!students) return next(new Error("Error: no students found"));
  res.status(200).json({ success: "true", students, noOfStudents: students.length });
};

const updateStudent = async (req, res, next) => {
  const { error } = updateStudentValidation(req.body);
  if (error) throw error;

  let { admNo } = req.query;
  const student = await Student.findOneAndUpdate({ admNo }, req.body, {
    new: true,
  });
  if (!student) return next(new Error("Error: no such student found"));

  res
    .status(200)
    .json({ status: "success", msg: "user updated successfully", student });
};

const deleteStudent = async (req, res, next) => {
  let { admNo } = req.query;
  const student = await Student.findOneAndDelete({ admNo });
  if (!student) return next(new Error("Error: no such student found"));

  res.status(200).json({ status: "success", msg: "user deleted successfully" });
};



module.exports = {
  addStudent,
  getStudents,
  getOneStudent,
  getAllStudents,
  deleteStudent,
  updateStudent,
};

// *******************************************************************************************************************
// const getStudent = async (req,res) => {
//     try {
//         const {firstName, lastName} = req.query;
//         const student = await Student.findOne({firstName,lastName})
//         if(!student){
//             return res.status(404).json({msg:`student with name: ${firstName} ${lastName} does not exist`})
//         }
//         res.status(200).json({student, msg:"student found!"})
//     } catch (error) {
//         res.status(500).json({msg:error})
//     }
// }
