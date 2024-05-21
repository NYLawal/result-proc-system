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

  if (!staff) return next(new Error("Error: no staff found"));
  res.status(200).json({
    status: "Success",
    staff_list: staff,
    noOfStaff: staff.length
  });
};

const getTeachers = async (req, res, next) => {
  const teachers = await Staff.find({ role: "teacher" })
    .sort({ stafferName: 1 })
    .select('_id stafferName email gender address phoneNumber role isAdmin teacherClass')

  if (!teachers) return next(new Error("Error: no teachers found"));
  res.status(200).json({
    status: "Success",
    teachers_list: teachers,
    noOfStaff: teachers.length
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
  if (!staffer) return next(new Error("Error: no such staffer found"));

  res
    .status(200)
    .json({ status: "success", message: "Staffer found", staffer });
};


const updateStaff = async (req, res, next) => {
  const { error } = updateStaffValidator(req.body);
  if (error) throw error;

  // const { email, stafferName, gender, address, phoneNumber, role, teacherClass } = req.body;
  const { email } = req.body;
  const staffer = await Staff.findOneAndUpdate({ email }, req.body, {new: true}) 
    
  if (!staffer) return next(new Error("Error: the staffer does not exist"));

  res
    .status(200)
    .json({ status: "success", message: "Staffer information is up-to-date", staffer });
};


const deleteStaff = async (req, res, next) => {
  const { error } = deleteStaffValidator(req.body);
  if (error) throw error;
  
  let { email } = req.body;
  const staff = await Staff.findOneAndDelete({ email });
  if (!staff) return next(new Error("Error: no such staff found"));

  res.status(200).json({ status: "success", message: "Staff has been deleted" });
};

module.exports = { addStaff, getStaff, getTeachers, editStaffQuery, updateStaff, deleteStaff }