const Student = require("../models/studentModel");
const Billing = require("../models/billingsModel");

const { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } =
    require('../middleware/errors')


const updateBills = async (req, res, next) => {
    for (let n = 0; n < req.body.length; n++) {
        let admNo = req.body[n].admNo
        let studentName = req.body[n].studentName

        const isCurrentStudent = await Student.findOne({ admNo })
        if (isCurrentStudent.studentStatus == "past") {
            continue;
        }
        // check whether student exists in the billings database, if not, add their data
        const alreadyHasBill = await Billing.findOne({ admissionNumber: admNo })
        if (!alreadyHasBill) {
            const addBill = await Billing.create({
                ...req.body, admissionNumber: admNo, studentName
                // admissionNumber: admNo, 
                // studentName ,
                // tuitionfee: req.body[n].tuitionfee,
                // txtbkfee : req.body[n].txtbkfee,
                // developmentfee : req.body[n].developmentfee,
                // graduationfee : req.body[n].graduationfee,
            });
        }
        else {
            alreadyHasBill.tuitionfee = +req.body[n].tuitionfee
            alreadyHasBill.txtbkfee = +req.body[n].txtbkfee
            alreadyHasBill.developmentfee = +req.body[n].developmentfee
            alreadyHasBill.graduationfee = +req.body[n].graduationfee
            // alreadyHasBill.portalfee = +req.body.studentsbills[n].portalfee
            // alreadyHasBill.examfee = +req.body.studentsbills[n].examfee
            // alreadyHasBill.uniformfee = +req.body.studentsbills[n].uniformfee
            // alreadyHasBill.fulltahfizfee = +req.body.studentsbills[n].fulltahfizfee
            // alreadyHasBill.admissionformfee = +req.body.studentsbills[n].admissionformfee
            // alreadyHasBill.parentdiscount = +req.body.studentsbills[n].parentdiscount
            // alreadyHasBill.staffdiscount = +req.body.studentsbills[n]. staffdiscount
            // alreadyHasBill.scholarshipgrant = +req.body.studentsbills[n].scholarshipgrant
            // alreadyHasBill.totalfeesdue = +req.body.studentsbills[n].totalfeesdue
            alreadyHasBill.save()
        }
    }

    res.status(200).json({ status: "success", message: "Billing updated successfully" });
};

const getBill = async (req, res, next) => {
    const { admNo } = req.query;
    const student = await Billing.findOne({ admNo });
    if (!student) return next(new Error("Error: no such student found!"));
    res.status(200).json({ status: "success", student, message: "student found" });
};


module.exports = { updateBills, getBill }