const mongoose = require('mongoose')


const carddetailSchema = new mongoose.Schema({
    programme: {
        type: String,
        trim:true,
    },
    maxAttendance:{
        type: Number,
        trim:true,
        default: 26
        },
    nextTermDate: {
        type: String,
        trim:true,
    },
    principalSignature:{
        type: String,
        trim:true,
    },
    proprietorSignature:{
        type: String,
        trim:true,
    }
    })

    module.exports = mongoose.model('Carddetail', carddetailSchema)