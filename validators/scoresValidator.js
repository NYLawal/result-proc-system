const Joi = require("joi");

//  function validateclass(studentClass) {
//     let schema;
//     if (studentClass === "tamyidi" || studentClass === "adonah" || studentClass === "rawdoh") {
//         schema = Joi.object({
//             hifz: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             hadith: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             imlah: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             khatu: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             taajiyya: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             adhkaar: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             lugha: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
            
//         })
//         return schema.validate(studentClass);
//     }
// }


function addScoresValidation(scores) {
    const schema = Joi.object({
        // admNo: Joi.string()
        //     .required()
        //     .regex(/^RSM+[0-9]{1,4}/)
        //     .messages({ "string.pattern.base": "invalid admission number" }),
      
        session: Joi.string()
            .required()
            .error(
                new Error(
                    "session cannot be empty and must be in the format xxxx/yyyy"
                )
            ),
        term: Joi.string().required(),
        className: Joi.string().required().valid("tamyidi", "rawdoh", "adonah", "awwal ibtidahi", "thaani ibtidahi", "thaalith ibtidahi", "roobi ibtidahi", 
        "khamis ibtidahi", "awwal idaadi", "thaani idaadi", "thaalith idaadi").error(new Error("please input a valid class name")),
        subjects:{
            hifz: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }),
            hadith: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }),
            imlah: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }),
        }
    
}).strict();

    return schema.validate(scores);
}




module.exports = {
    addScoresValidation,
};