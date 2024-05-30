const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const config= require('../config/default.json')

const staffSchema = new mongoose.Schema(
  {
    stafferName: {
        type: String,
        required:true,
        maxlength: 50
      },
    email: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    //   index: { unique: true },
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    password: {
      type: String,
      maxlength: 1024
    },
    gender: {
      type: String,
      required: [true, "gender cannot be empty"],
      enum: {
        values: ["male", "female"],
        message: "{VALUE} is not supported, student can either be male or female",
      },
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
      maxlength: 255
    },
    phoneNumber: {
      type: String,
      required: true,
      maxlength: 25
    },
    teacherClass: {
      type: String,
      maxlength: 25,
      lowercase: true,
      trim:true
    },
    teacherProgramme: {
      type: String,
      maxlength: 25,
      lowercase: true,
      trim:true
    },
    role: {
      type: String,
      default: "teacher",
      lowercase: true,
      trim:true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    serialNo: {
      type: Number
    },
  },
  { timestamps: true }
);



// staffSchema.methods.generateToken = function(){
//   const payload = {
//     _id: this._id,
//     email: this.email,
//     role: this.stafferRole,
//     isAdmin: this.isAdmin
//   }
//   const token = jwt.sign(payload, process.env.jwt_secret_key, { expiresIn: process.env.jwt_lifetime });
//   return token 
// }


const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;