const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const config= require('../config/default.json')

const quizSchema = new mongoose.Schema({
    quizlink: {
      type: String,
      trim:true
    },
    updatedAt: {
      type: Date,
      expires: 1800 //30 minutes
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Quiz", quizSchema);