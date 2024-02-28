const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    quran:[
        {
            test:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            exam:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            total:Number,
            grade:String
        }
    ],
    
    fiqh:[
        {
            test:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            exam:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            total:Number,
            grade:String
        }
    ],

    tawheed:[
        {
            test:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            exam:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            total:Number,
            grade:String
        }
    ],

    hadith:[
        {
            test:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            exam:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            total:Number,
            grade:String
        }
    ],

    tajweed:[
        {
            test:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            exam:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            total:Number,
            grade:String
        }
    ],

    lugha:[
        {
            test:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            exam:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            total:Number,
            grade:String
        }
    ],

    tadribatuLughawiyyah:[
        {
            test:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            exam:{
                type:Number,
                required:[true, 'score cannot be empty'],
                trim:true,
                maxlength:[2, 'score cannot be more than 2 characters']
            },
            total:Number,
            grade:String
        }
    ],


})


module.exports = mongoose.model('Scores', scoreSchema)