const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
    admissionNumber: String,
    student_name: String,
    programme: String,
    attendanceRecord:[{
      sessionName: String,
      className: String,
      term: [{ 
        termName: String,
          attendance:[{
            termdate:String,
            presence:String
          }]
      }],     
    }]
},
{ timestamps: true }
)


module.exports = mongoose.model('Attendances', attendanceSchema)


