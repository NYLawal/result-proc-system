const mongoose = require('mongoose')
const classSchema = require('./classModel')

const scoreSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
        required: true,
      },
    AdmissionNumber: String,
    Name: String,
    
    scores:[{
    session:  {
        type: String,
        required: [true, "session cannot be empty"]
    },
    term:  {
        type: String,
        required: [true, "term cannot be empty"],
        enum: {
            values: ["first", "second", "third"],
            message: "{VALUE} is not supported, input a valid term",
          },
          lowercase: true,
    },
    className: {
        type: String,
        required: [true, "present class cannot be empty"],
        enum: {
          values: ["tamyidi", "rawdoh", "adonah", "awwal ibtidahi", "thaani ibtidahi", "thaalith ibtidahi", "raabi ibtidahi", 
          "khaamis ibtidahi", "awwal idaadi", "thaani idaadi", "thaalith idaadi"],
          message: "{VALUE} is not supported, input a valid class",
        },
        lowercase: true,
      },
    subjects:[{
         subjectName:{
              type:String,
              trim:true,
              required: [true, "subject cannot be empty"],
              // enum: {
              //   values: ["fiqh", "hadith", "tawheed", "tafseer", "tadribaatuLugha", "lugha", "imlah", "hifz", "tajweed", "tahbeer", 
              //   "taajiyya", "qiraaha", "khatu", "adhkaar", "nahw", "sarf"],
              //   message: "{VALUE} is not supported, input a valid subject",
              // },
               },
         testScore:{
              type:Number,
              trim:true,
              required: [true, "test score cannot be empty"],
               maxlength:[2, 'score cannot be more than 2 characters']
               },
         examScore:{
              type:Number,
              trim:true,
              required: [true, "exam score cannot be empty"],
               maxlength:[2, 'score cannot be more than 2 characters']
               }
    }],
   
    totalScore: Number,
    avgPercent: Number,
    position: Number,
    teacherComment: String,
    // teacherSignature:Image
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