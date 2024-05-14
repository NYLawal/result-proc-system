const mongoose = require("mongoose");
const scoreSchema = require("./scoreModel");

const studentSchema = new mongoose.Schema({
  admNo: {
    type: String,
    required: [true, "admission number cannot be empty"],
    unique: true,
    trim: true,
    maxlength: [10, "maximum characters for admission number is 10"],
    match: [/^RSM+[0-9]{1,4}/, "invalid admission number"],
  },

  firstName: {
    type: String,
    required: [true, "firstname cannot be empty"],
    trim: true,
    maxlength: [25, "maximum characters for student name is 25"],
  },

  lastName: {
    type: String,
    required: [true, "surname cannot be empty"],
    trim: true,
    maxlength: [25, "maximum characters for student name is 15"],
  },

  email: {
    type: String,
    trim: true,
    unique:true,
  //   index: { unique: true },
    match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
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

  age: {
    type: Number,
    required: [true, "age cannot be empty"],
    min: [4, "student cannot be less than 4years"],
    max: [25, "student cannot be more than 25years"],
  },

  entryClass: {
    type: String,
    required: [true, "entry class cannot be empty"],
    enum: {
      values: ["tamyidi", "rawdoh", "adonah", "awwal ibtidahi", "thaani ibtidahi", "thaalith ibtidahi", "roobi ibtidahi", 
      "khamis ibtidahi", "awwal idaadi", "thaani idaadi", "thaalith idaadi"],
      message: "{VALUE} is not supported, input a valid entry class",
    },
    lowercase: true,
  },

  address: {
    type: String,
    required: [true, "address cannot be empty"],
    minlength: [
      20,
      "too short for a proper address, please input the correct one",
    ],
  },

  parentContact: {
    type: String,
    required: [true, "contact cannot be empty"],
    minlength: [10, "incorrect number of digits for phone mumber"],
    maxlength: [11, "incorrect number of digits for phone mumber"],
  },

  status: {
    type: String,
    required: [true, "status cannot be empty"],
    enum: {
      values: ["current", "past"],
      message: "{VALUE} is not supported, status can either be current or past",
    },
    default: "current",
    lowercase: true,
  },

  registeredOn: {
    type: Date,
    default: Date.now,
  },

  presentClass: {
    type: String,
    required: [true, "present class cannot be empty"],
    enum: {
      values: ["tamyidi", "rawdoh", "adonah", "awwal ibtidahi", "thaani ibtidahi", "thaalith ibtidahi", "roobi ibtidahi", 
      "khamis ibtidahi", "awwal idaadi", "thaani idaadi", "thaalith idaadi"],
      message: "{VALUE} is not supported, input a valid class",
    },
    lowercase: true,
  },
  // scores:{
  //     type: scoreSchema,
  //     required:true
  // },

 
});
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
