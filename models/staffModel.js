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
    class: {
      type: String,
      maxlength: 25
    },
    stafferRole: {
      type: String,
      default: "teacher",
      lowercase: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    // history: {
    //   type: Array,
    //   default: [],
    // },
  },
  { timestamps: true }
);

// staffSchema.pre('save', async function() {
//  const salt = await bcrypt.genSalt(10)
//  this.password = await bcrypt.hash(this.password, salt)
// })

staffSchema.methods.generateToken = function(){
  const payload = {
    _id: this._id,
    email: this.email,
    role: this.stafferRole,
    isAdmin: this.isAdmin
  }
  const token = jwt.sign(payload, process.env.jwt_secret_key, { expiresIn: process.env.jwt_lifetime });
  return token 
}

// staffSchema.methods.comparePassword = async function(stafferPassword){
//   const isMatch = await bcrypt.compare(stafferPassword, this.password)
//   return isMatch
// }

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;