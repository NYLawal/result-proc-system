const Student = require("../models/studentModel");
const Billing = require("../models/billingsModel");

const { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } =
    require('../middleware/errors')


const updateBills = async (req, res, next) => {
    const {classname, term, session} = req.body
    for (let n = 0; n < req.body.studentsbills.length; n++) {
        let admNo = req.body.studentsbills[n].admNo
        let studentName = req.body.studentsbills[n].studentName

        const isCurrentStudent = await Student.findOne({ admNo })
        if (isCurrentStudent.studentStatus == "past") {
            continue;
        }
        // check whether student exists in the billings database, if not, add their data
        const alreadyHasBill = await Billing.findOne({ admissionNumber: admNo })
        if (!alreadyHasBill) {
            const addBill = await Billing.create({
                ...req.body,
                admissionNumber: admNo, 
                studentName,
               "latestBill.tuitionfee": req.body.studentsbills[n].tuitionfee,
               "latestBill.txtbkfee" : req.body.studentsbills[n].txtbkfee,
               "latestBill.developmentfee" : req.body.studentsbills[n].developmentfee,
               "latestBill.graduationfee" : req.body.studentsbills[n].graduationfee,
               "latestBill.portalfee" : req.body.studentsbills[n].portalfee,
               "latestBill.examfee" : req.body.studentsbills[n].examfee,
               "latestBill.uniformfee" : req.body.studentsbills[n].uniformfee,
               "latestBill.lasttermbalance" : req.body.studentsbills[n].lasttermbal,
               "latestBill.fulltahfizfee" : req.body.studentsbills[n].fulltahfizfee,
               "latestBill.admissionformfee" : req.body.studentsbills[n].admissionformfee,
               "latestBill.parentdiscount" : req.body.studentsbills[n].parentdiscount,
               "latestBill.staffdiscount" : req.body.studentsbills[n]. staffdiscount,
               "latestBill.scholarshipgrant" : req.body.studentsbills[n].scholarshipgrant,
               "latestBill.totalfeesdue" : req.body.studentsbills[n].totalfeesdue
            });
        }
        else {
            alreadyHasBill.classname = classname
            alreadyHasBill.session = session
            alreadyHasBill.term = term
            alreadyHasBill.latestBill.tuitionfee = req.body.studentsbills[n].tuitionfee
            alreadyHasBill.latestBill.txtbkfee = req.body.studentsbills[n].txtbkfee
            alreadyHasBill.latestBill.developmentfee = req.body.studentsbills[n].developmentfee
            alreadyHasBill.latestBill.graduationfee = req.body.studentsbills[n].graduationfee
            alreadyHasBill.latestBill.portalfee = req.body.studentsbills[n].portalfee
            alreadyHasBill.latestBill.examfee = req.body.studentsbills[n].examfee
            alreadyHasBill.latestBill.uniformfee = req.body.studentsbills[n].uniformfee
            alreadyHasBill.latestBill.lasttermbalance = req.body.studentsbills[n].lasttermbal
            alreadyHasBill.latestBill.fulltahfizfee = req.body.studentsbills[n].fulltahfizfee
            alreadyHasBill.latestBill.admissionformfee = req.body.studentsbills[n].admissionformfee
            alreadyHasBill.latestBill.parentdiscount = req.body.studentsbills[n].parentdiscount
            alreadyHasBill.latestBill.staffdiscount = req.body.studentsbills[n]. staffdiscount
            alreadyHasBill.latestBill.scholarshipgrant = req.body.studentsbills[n].scholarshipgrant
            alreadyHasBill.latestBill.totalfeesdue = req.body.studentsbills[n].totalfeesdue
            alreadyHasBill.save()
        }
    }

    res.status(200).json({ status: "success", message: "Billing updated successfully" });
};

const getBill = async (req, res, next) => {
    const { admNo } = req.query;
    const astudentbill = await Billing.findOne({ admissionNumber : admNo });
    if (!astudentbill) return next(new Error("Error: no such student found!"));
    res.status(200).json({ status: "success", astudentbill, message: "close this to view bill" });
};


module.exports = { updateBills, getBill }