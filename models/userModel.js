const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const config= require('../config/default.json')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique:true,
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1024
    },
    userRole: {
      type: String,
      default: "user",
      lowercase: true,
      trim:true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    otherRole:{
      type: String,
      default: "nil",
      lowercase: true,
      trim:true,
      enum: {
        values: ["nil", "parent"],
        message: "{VALUE} is not supported, other role can either be parent or nil",
      },
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function() {
 const salt = await bcrypt.genSalt(10)
 this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.generateToken = function(){
  const payload = {
    _id: this._id,
    email: this.email,
    role: this.userRole,
    other_role: this.otherRole,
    isAdmin: this.isAdmin
  }
  const token = jwt.sign(payload, process.env.jwt_secret_key, { expiresIn: process.env.jwt_lifetime });
  return token 
}

userSchema.methods.comparePassword = async function(userPassword){
  const isMatch = await bcrypt.compare(userPassword, this.password)
  return isMatch
}

const User = mongoose.model("User", userSchema);
module.exports = User;