const mongoose = require('mongoose')


const studentSchema = new mongoose.Schema({
            
    firstName:{
        type: String,
        required:[true, 'firstname cannot be empty'],
        trim:true,
        maxlength:[25, 'maximum characters for student name is 15']
        },

    lastName:{
        type: String,
        required:[true, 'surname cannot be empty'],
        trim:true,
        maxlength:[25, 'maximum characters for student name is 15']
        },
    
    age:{
        type: Number,
        required:[true, 'age cannot be empty'],
        maxlength:[2, 'please input correct age, cannot be more than 2 characters']
        },

    address:{
        type: String,
        required:[true, 'address cannot be empty'],
        minlength:[20, 'too short for a proper adress,please input the correct one']
        },

    parentContact:{
        type: Number,
        required:[true, 'contact cannot be empty'],
        minlength:[10, 'incorrect number of digits for phone mumber'],
        maxlength:[11, 'incorrect number of digits for phone mumber']
        },
    
    totalScore: Number,
    avgPercent: Number,
    position:Number,
    teacherComment:String,
    // teacherSignature:Image
    
})

module.exports = mongoose.model("Student", studentSchema)
