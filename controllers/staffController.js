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
    
    const user = await User.findOne({email: req.body.email});
    if (!user) throw new NotFoundError("Error: staff is not registered")
    user.userRole = role;  //update role of staff in user database
    
    if (role === "superadmin" || role === "admin" || role === "bursar"){
        req.body.isAdmin = true;
        user.isAdmin = true;  //change staff to admin in user database
    }
    user.save()
    const bursarExists = await Staff.findOne({ role: "bursar" });
    if (bursarExists) throw new BadUserRequestError("Error: A bursar is already registered");

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
      
        if (!staff) return next(new Error("Error: no staff found"));
        res.status(200).json({ 
        status: "Success", 
        staff_list: _.pick(staff, ['_id','stafferName','email','gender','address','phoneNumber','role','isAdmin' ]), 
        noOfStudents: staff.length });
      };

      

    module.exports = {addStaff, getStaff}