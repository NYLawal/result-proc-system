const mongoose = require('mongoose')


const classSchema = new mongoose.Schema({
    className:{
        type: String,
        trim:true,
        },
    programme: {
        type: String,
        trim:true,
    },
    subjects: [],
    noInClass:{
        type: Number,
        maxlength:[3, 'please check the number you entered']
        },
    maxAttendance:{
        type: Number,
        default:26,
        maxlength:[2, 'attendance cannot be more than 2 characters']
        },    
    teacherSignature:{
        type: String,
        trim:true,
    }
    })

    module.exports = mongoose.model('Class', classSchema)