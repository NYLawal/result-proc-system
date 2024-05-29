const { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } =
  require('../middleware/errors')
require('dotenv').config();
const _ = require('lodash')
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const Student = require("../models/studentModel");
const Token = require('../models/tokenModel')

const {
  addStaffValidator,
  editStaffQueryValidator,
  updateStaffValidator,
  deleteStaffValidator
} = require("../validators/staffValidator");


const addStaff = async (req, res) => {
  const { error } = addStaffValidator(req.body)
  if (error) throw error

  const emailExists = await Staff.findOne({ email: req.body.email });
  if (emailExists) throw new BadUserRequestError("Error: An account with this email already exists");

  const role = req.body.role;
  let isAdmin = false;

  if (role === "bursar") {
    const bursarExists = await Staff.findOne({ role: "bursar" });
    if (bursarExists) throw new BadUserRequestError("Error: A bursar is already registered");
  }
  if (role === "superadmin" || role === "admin" || role === "bursar") {
    req.body.isAdmin = true;
    isAdmin = true;
  }
  const user = await User.findOneAndUpdate({ email: req.body.email }, { userRole: role, isAdmin }, {
    new: true,
  });
  const newStaffer = await Staff.create(req.body);

  res.status(200).json({
    status: "Success",
    message: `Successfully added as ${role}`,
    staffer: _.pick(newStaffer, ['stafferName', 'email', 'stafferRole', 'isAdmin'])
  })
}

// check if page returned is the last
function getEndOfPage(staffNum, pgSize){
  let lastpage;
  const wholediv =  Math.floor(staffNum / pgSize) ;
  const modulus =  staffNum % pgSize ;
  if (modulus == 0) lastpage = wholediv;
  else lastpage = wholediv+1;
  // console.log(lastpage)
  return lastpage
}

const getStaff = async (req, res, next) => {
  let pageNumber = +req.params.page || 1;
  const pageSize = 7;

  const staff = await Staff.find({})
    .sort({ gender: 1 })
    .select('_id stafferName email gender address phoneNumber role isAdmin')
    if (!staff) throw new NotFoundError("Error: no staff found");
  const noOfStaff = staff.length;

  const staffperpage = await Staff.find()
  .sort({ role: 1 })
  .skip((pageNumber - 1) * pageSize)
  .limit(pageSize);

  const pgnum = getEndOfPage(noOfStaff, pageSize)


  for (let i=0; i<staffperpage.length; i++){  
    let serialno= (pageSize*pageNumber)-(pageSize-(i+1))
    staffperpage[i].serialNo=serialno;
  }

  res.status(200).json({
    status: "Success",
    staff_list: staffperpage,
    noOfStaff,
    page:pageNumber, 
    pgnum
  });
};

const getTeachers = async (req, res, next) => {
  let pageNumber = +req.params.page || 1;
  const pageSize = 7;

  const teachers = await Staff.find({ role: "teacher" })
    .sort({ stafferName: 1 })
    .select('_id stafferName email gender address phoneNumber role isAdmin teacherClass teacherProgramme')
    console.log(teachers)
  if (!teachers) throw new NotFoundError("Error: no teachers found");

  const noOfStaff = teachers.length;

  const teachersperpage = await Staff.find({ role: "teacher" })
  .sort({ gender: 1 })
  .skip((pageNumber - 1) * pageSize)
  .limit(pageSize);

  const pgnum = getEndOfPage(noOfStaff, pageSize)

  for (let i=0; i<teachersperpage.length; i++){  
    let serialno= (pageSize*pageNumber)-(pageSize-(i+1))
    teachersperpage[i].serialNo=serialno;
  }

  res.status(200).json({
    status: "Success",
    teachers_list: teachersperpage,
    noOfStaff,
    page:pageNumber,
    pgnum
  });
};
const getTeacherClass = async (req, res, next) => {
  // const teacher = await Staff.findOne({$and: [{email:req.user.email}, {role:"teacher"}]})
  const teacher = await Staff.findOne({email:req.user.email})
    .select('teacherClass teacherProgramme')

  if (!teacher) throw new NotFoundError("Error: You have not been assigned as a teacher");
  res.status(200).json({
    status: "Success",
    message: "Teacher class and programme successfully returned",
    teacher
  });
};

const assignAsTeacher = async (req, res, next) => {
  // const teacher = await Staff.findOne({$and: [{email:req.user.email}, {role:"teacher"}]})
  const {email, teacherClass, teacherProgramme} = req.body
  const teacher = await Staff.findOne({email})
  if (!teacher) throw new NotFoundError("Error: no such staff found");

  teacher.teacherClass = teacherClass;
  teacher.teacherProgramme = teacherProgramme;
  teacher.save();

  res.status(200).json({
    status: "Success",
    message: "Teacher successfully assigned",
    teacher
  });
};

const editStaffQuery = async (req, res, next) => {
  const { error } = editStaffQueryValidator(req.body);
  if (error) throw error;

  let { email } = req.body;
  const staffer = await Staff.findOne({email }) 
    // $and: [
    // {email }, 
    // {stafferName: {$regex: "stafferName", $options: "i"} },
    // ],
  // });
  if (!staffer) throw new NotFoundError("Error: no such staffer found");

  res
    .status(200)
    .json({ status: "success", message: "Staffer found", staffer });
};


const updateStaff = async (req, res, next) => {
  const { error } = updateStaffValidator(req.body);
  if (error) throw error;
 const userRole = req.body.role;
  
  const { email } = req.body;

  const user = await User.findOneAndUpdate({ email: req.body.email }, { userRole }, {
    new: true,
  });
  if (!user) throw new NotFoundError("Error: This staff is not registered. They need to sign up before their details can be updated");

  const staffer = await Staff.findOneAndUpdate({ email }, req.body, {new: true}) 
    if (!staffer) throw new NotFoundError("Error: the staffer does not exist");

  res
    .status(200)
    .json({ status: "success", message: "Staffer information is up-to-date", staffer });
};


const deleteStaff = async (req, res, next) => {
  const { error } = deleteStaffValidator(req.body);
  if (error) throw error;
  
  let { email } = req.body;
  const staff = await Staff.findOneAndDelete({ email });
  if (!staff) throw new NotFoundError("Error: no such staff found");

  const user = await User.findOneAndDelete({ email });
  if (!user) throw new NotFoundError("Error: This user is not yet registered, but has been removed as a staffer");
  
  res.status(200).json({ status: "success", message: "Staff has been deleted" });
};

module.exports = { addStaff, getStaff, getTeachers, getTeacherClass, assignAsTeacher, editStaffQuery, updateStaff, deleteStaff }