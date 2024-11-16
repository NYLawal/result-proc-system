const mongoose = require('mongoose')

const billingSchema = new mongoose.Schema(
    {
        admissionNumber: String,
        studentName: String,
        tuitionfee: Number,
        txtbkfee: Number,
        developmentfee: Number,
        graduationfee: Number,
        portalfee: Number,
        examfee: Number,
        uniformfee: Number,
        fulltahfizfee: Number,
        admissionformfee: Number,
        parentdiscount: Number,
        staffdiscount: Number,
        scholarshipgrant: Number,
        totalfeesdue: Number,
    },

    { timestamps: true }
)


const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;



