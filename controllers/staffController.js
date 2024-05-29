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

const getStaff = async (req, res, next) => {
  const staff = await Staff.find({})
    .sort({ role: 1 })
    .select('_id stafferName email gender address phoneNumber role isAdmin')

  if (!staff) throw new NotFoundError("Error: no staff found");
  res.status(200).json({
    status: "Success",
    staff_list: staff,
    noOfStaff: staff.length
  });
};

const getTeachers = async (req, res, next) => {
  const teachers = await Staff.find({ role: "teacher" })
    .sort({ stafferName: 1 })
    .select('_id stafferName email gender address phoneNumber role isAdmin teacherClass teacherProgramme')
    console.log(teachers)

  if (!teachers) throw new NotFoundError("Error: no teachers found");
  res.status(200).json({
    status: "Success",
    teachers_list: teachers,
    noOfStaff: teachers.length
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
  const staffer = await Staff.findOneAndUpdate({ email }, req.body, {new: true}) 
    if (!staffer) throw new NotFoundError("Error: the staffer does not exist");

  const user = await User.findOneAndUpdate({ email: req.body.email }, { userRole }, {
    new: true,
  });
  if (!user) throw new NotFoundError("Error: this user is not registered");
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

  res.status(200).json({ status: "success", message: "Staff has been deleted" });
};

module.exports = { addStaff, getStaff, getTeachers, getTeacherClass, assignAsTeacher, editStaffQuery, updateStaff, deleteStaff }