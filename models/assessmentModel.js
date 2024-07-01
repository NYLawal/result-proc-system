const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const config= require('../config/default.json')

const assessmentSchema = new mongoose.Schema({
    className: {
      type: String,
      maxlength: 25,
      lowercase: true,
      trim:true
    },
    programme: {
      type: String,
      maxlength: 25,
      lowercase: true,
      trim:true
    },
    lesson: [{
     subjectName: {
        type: String,
        trim:true
      },
     lessonLink: {
        type: String,
        trim:true
      },
      assessmentLink: {
        type: String,
        trim:true
      },
}], 
    createdAt: {
      type: Date,
      default:Date.now,
      expires: 604800 //7 days
    },
  },
  { timestamps: true }
);


// assessmentSchema.path('updatedAt').index({ expires: this.expiryInSeconds });

// assessmentSchema.pre("save", function(){
//   this.updatedAt.expires = this.expiryInSeconds
// })

module.exports = mongoose.model("Assessment", assessmentSchema);