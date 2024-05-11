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
    //   index: { unique: true },
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    password: {
      type: String,
      required: true,
      maxlength: 1024
    },
    userRole: {
      type: String,
      default: "user",
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

userSchema.pre('save', async function() {
 const salt = await bcrypt.genSalt(10)
 this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.generateToken = function(){
  const payload = {
    _id: this._id,
    email: this.email,
    role: this.userRole,
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