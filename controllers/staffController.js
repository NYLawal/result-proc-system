const  { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } = 
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
    addStaffValidator
} = require("../validators/staffValidator");


const addStaff = async(req,res) =>{
    const {error} = addStaffValidator(req.body)
    if(error) throw error
   
    const emailExists = await Staff.findOne({ email: req.body.email });
    if (emailExists) throw new BadUserRequestError("Error: An account with this email already exists");

    const role = req.body.role;
    let isAdmin = false;
    
    if (role === "bursar"){
      const bursarExists = await Staff.findOne({ role: "bursar" });
      if (bursarExists) throw new BadUserRequestError("Error: A bursar is already registered");
      }
    if (role === "superadmin" || role === "admin" || role === "bursar"){
        req.body.isAdmin = true;
        isAdmin = true;
    }
    const user = await User.findOneAndUpdate({ email:req.body.email }, {userRole:role, isAdmin}, {
      new: true,
    });
    const newStaffer = await Staff.create(req.body);

    res.status(200).json({
    status: "Success",
    message: `Successfully added as ${role}`,
    staffer:  _.pick(newStaffer, ['stafferName', 'email', 'stafferRole', 'isAdmin' ])
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
        noOfStaff: staff.length });
      };

    const getTeachers = async (req, res, next) => {
        const teachers = await Staff.find({role:"teacher"})
          .sort({ stafferName: 1 })
          .select('_id stafferName email gender address phoneNumber role isAdmin teacherClass')
      
        if (!teachers) return next(new Error("Error: no teachers found"));
        res.status(200).json({ 
        status: "Success", 
        teachers_list: teachers,
        noOfStaff: teachers.length });
      };

      

    module.exports = {addStaff, getStaff, getTeachers}