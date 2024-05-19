const dbDebugger = require("debug")("app:db");
const Student = require("../models/studentModel");
const User = require("../models/userModel");
const {
  newStudentValidation,
  updateStudentValidation,
} = require("../validators/studentValidator");

const  { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } = 
require('../middleware/errors')

const classes = require("../models/classModel");
// const asyncWrapper = require('../middleware/async')

const addStudent = async (req, res, next) => {
  const { error } = newStudentValidation(req.body);
  if (error) throw error;
 
  if (req.body.email !== "nothing@nil.com"){
  const emailExists = await Student.findOne({ email: req.body.email });
  if (emailExists) throw new BadUserRequestError("Error: An account with this email already exists");
  }
  const admnoExists = await Student.findOne({ admNo: req.body.admNo });
  console.log(admnoExists)
  if (admnoExists) throw new BadUserRequestError("Error: A student with this admission number already exists");

  const student = await Student.create(req.body);
  res.status(201).json({ status: "success", student, message: "Student added successfully" });
};

const getStudents = async (req, res, next) => {
  const pageNumber = req.params.page;
  const pageSize = 5;
  let queryObject = req.query;
  console.log(queryObject)

  const { firstName, lastName, gender, address, entryClass, stateOfOrigin, maritalStatus, programme, presentClass, classStatus, studentStatus } = req.query;
  // let queryObject = {};

  if (firstName) {
    queryObject.firstName = { $regex: firstName, $options: "i" };
  }
  if (lastName) {
    queryObject.lastName = { $regex: lastName, $options: "i" };
  }
  if (entryClass) {
    queryObject.entryClass =  entryClass;
  }
  if (gender) {
    queryObject.gender = gender;
  }
  if (address) {
    queryObject.address = { $regex: address, $options: "i" };
  }
  if (stateOfOrigin) {
    queryObject.stateOfOrigin = { $regex: stateOfOrigin, $options: "i" };
  }
  if (maritalStatus) {
    queryObject.maritalStatus = maritalStatus;
  }
  if (presentClass) {
    queryObject.presentClass =  presentClass;
  }
  if (programme) {
    queryObject.programme = programme;
  }
  if (classStatus) {
    queryObject.classStatus = classStatus;
  }
  if (studentStatus) {
    queryObject.studentStatus = studentStatus;
  }
  if (Object.keys(queryObject).length === 0)
    return next(new Error("Error: no such criteria exists"));

  const students = await Student.find(queryObject)
    .sort({ admNo: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  if (students.length == 0)
    return next(new Error("Error: no such students found"));

  // for (let i=0; i<students.length; i++){
  //   let dateOfReg = students[i].registeredOn
  //   let dateonly = dateOfReg.substring(0,10);
  //   // let date = dateOfReg.split('T')[0]
    
  //   console.log(dateonly)
  //   students[i].registeredOn = dateonly
  // }
  res
    .status(200)
    .json({ status: "Success", students, noOfStudents: students.length });
};

const getOneStudent = async (req, res, next) => {
  const { admNo } = req.query;
  const student = await Student.findOne({ admNo });
  dbDebugger(student);
  if (!student) return next(new Error("Error: no such student found"));
  res.status(200).json({ status: "success", student, msg: "student found!" });
};

const getAllStudents = async (req, res, next) => {
  const pageNumber = req.params.page || 1;
  const pageSize = 15;

  const students = await Student.find({studentStatus:"current"})
    .sort({ admNo: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  if (!students) return next(new Error("Error: no students found"));
  res.status(200).json({ status: "success", students, noOfStudents: students.length });
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
