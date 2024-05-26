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
            remark: String
          }],
          comment: String
      }],
      
    }]
    
})


module.exports = mongoose.model('Scores', scoreSchema)



// subjects:{
//     hifz:
//         { name:{
//             type:Number,
//             trim:true,
//             maxlength:[2, 'score cannot be more than 2 characters']
//         },
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },
    
//     fiqh:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     tawheed:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     hadith:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     tajweed:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     lugha:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         } ,

//     tadribaatuLugha:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     imlah:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     adhkaar:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     khatu:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },


//     taajiyya:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     qiraaha:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     nahw:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     sarf:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     tafseer:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         },

//     tahbeer:
//         {
//             test:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             exam:{
//                 type:Number,
//                 trim:true,
//                 maxlength:[2, 'score cannot be more than 2 characters']
//             },
//             total:Number,
//             grade:String
//         }
//     },