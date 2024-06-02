const mongoose = require('mongoose')
const classSchema = require('./classModel')

const scoreSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
        required: true,
      },
    admissionNumber: String,
    student_name: String,
    scores:[{
      sessionName: String,
      className: String,
      term: [{ 
        termName: String,
          subjects: [{
            subjectName: String, 
            testScore: Number, 
            examScore: Number,
            totalScore: Number, 
            firstTermScore: Number,
            secondTermScore: Number,
            cumulativeScore: Number,
            cumulativeAverage: Number,
            remark: String,
          }],
          comment: String,
          grandTotal:Number,
          marksObtained:Number,
          avgPercentage:Number
      }],
      
    }]
    
})

// scoreSchema.pre('save', async function() {
//   console.log(this.scores.term)
//   this.grandTotal = this.scores.term.subjects.length * 100;
//   this.marksObtained = scores.term.subjects.reduce((accumulator , score) => {
//     return accumulator += score.totalScore;
//   }, 0)
//   this.avgPercentage = (this.marksObtained/this.grandTotal) * 100
//  })

module.exports = mongoose.model('Scores', scoreSchema)


