const mongoose = require("mongoose");
const scoreSchema = require("./scoreModel");

const studentSchema = new mongoose.Schema({
  admNo: {
    type: String,
    required: [true, "admission number cannot be empty"],
    unique:[true, "a student with this admission number already exists"],
    trim: true,
    maxlength: [10, "maximum characters for admission number is 10"],
    match: [/^MDRS+[0-9]{1,4}|^MDBR+[0-9]{1,4}|^MDUM+[0-9]{1,4}/, "invalid admission number"],
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

  gender: {
    type: String,
    required: [true, "gender cannot be empty"],
    enum: {
      values: ["male", "female"],
      message: "{VALUE} is not supported, student can either be male or female",
    },
    lowercase: true,
  },

  entryClass: {
    type: String,
    required: [true, "entry class cannot be empty"],
    // enum: {
    //   values: ["tamyidi", "rawdoh", "adonah", "awwal ibtidaahi", "thaani ibtidaahi", "thaalith ibtidaahi", "raabi ibtidaahi", 
    //   "khaamis ibtidaahi", "awwal idaadi", "thaani idaadi", "thaalith idaadi"],
    //   message: "{VALUE} is not supported, input a valid entry class",
    // },
    lowercase: true,
  },

  address: {
    type: String,
    required: [true, "input a valid address"],
    minlength: [
      15,
      "too short for a proper address, please input the correct one",
    ],
  },

  phoneNumber: {
    type: String,
    trim:true,
    required: [true, "contact number cannot be empty"]
  },

  email: {
    type: String,
    trim: true,
    match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  },

  parentEmail: {
    type: String,
    trim: true,
    required:[true, "parent email cannot be empty"],
    match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  },

  stateOfOrigin: {
    type: String,
    required: [true, "state cannot be empty"],
    trim: true,
    maxlength: [20, "maximum characters for state of origin is 16"],
  },

  maritalStatus: {
    type: String,
    required: [true, "status cannot be empty"],
    enum: {
      values: ["married", "single"],
      message: "{VALUE} is not supported, status can either be single or married",
    },
    default: "single",
    lowercase: true,
  },

  programme: {
    type: String,
    required: [true, "programme cannot be empty"],
    default: "children madrasah",
    lowercase: true,
    trim:true,
  },

  studentStatus: {
    type: String,
    enum: {
      values: ["current", "past"],
      message: "{VALUE} is not supported, status can either be current or past",
    },
    default: "current",
    lowercase: true,
    trim:true,
  },
  
  nonStudentStatus: {
    type: String,
    enum: {
      values: [ "graduated", "expelled", "left"],
      message: "{VALUE} is not supported",
    },
    default: "graduated",
    lowercase: true,
    trim:true,
  },

  registeredOn: {
    type: Date,
    default: Date.now,
  },

  presentClass: {
    type: String,
    lowercase: true,
    trim:true,
  },

  classStatus: {
    type: String,
    enum: {
      values: [ "promoted", "repeated"],
      message: "{VALUE} is not supported",
    },
    default: "promoted",
    lowercase: true,
  },

  paymentStatus: {
    type: String,
    enum: {
      values: [ "paid", "owing", "scholarship"],
      message: "{VALUE} is not supported",
    },
    default: "owing",
    lowercase: true,
    trim:true,
  },

  role: {
    type: String,
    default: "student",
    lowercase: true,
    trim:true,
  },

  dateOfRegistration: {
    type: String
  },

  serialNo: {
    type: Number
  },
  
});

// studentSchema.pre("save", function(){
//   this.presentClass = this.entryClass
// })

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
