const mongoose = require('mongoose')


const classSchema = new mongoose.Schema({
    className:{
        type: String,
        // required:[true, 'classname cannot be empty'],
        trim:true,
        },
    subjects: []
    // subjects: [{
    //     subjectName:{
    //         type:String,
    //         trim:true,
    //         // required: [true, "subject cannot be empty"],
    //          },
    // }]
    
    // session:{
    //     type: String,
    //     required:[true, 'session cannot be empty'],
    //     trim:true,
    //     maxlength:[9, 'session cannot be more than 9 characters in the format - xxxx/xxxx']
    //     },
        
    // term:{
    //     type: String,
    //     required:[true, 'term cannot be empty'],
    //     trim:true,
    //     maxlength:[3, 'term cannot be more than 3 characters in the format - 1st']
    //     },

    // noInClass:{
    //     type: Number,
    //     // required:[true, 'term cannot be empty'],
    //     trim:true,
    //     maxlength:[3, 'maximum characters for number of students is 3']
    //     },

    // teacherName:{
    //     type: String,
    //     required:[true, 'a class must have an assigned teacher'],
    //     trim:true,
    //     maxlength:[50, 'name cannot be more than 50 characters']
    //     },    

    })

    module.exports = mongoose.model('Class', classSchema)