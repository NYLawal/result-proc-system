const Joi = require("joi");
const { ValidationError } = require("../middleware/errors");
// const dbDebugger = require("debug")("app:db");

// function addScoresValidation(scores) {
//     let classSubject;
//     if (scores.className ==="awwal idaadi" || scores.className ==="thaani idaadi"|| scores.className ==="thaalith idaadi"){
//     classSubject = Joi.string().required().valid("fiqh", "hadith", "tawheed", "tafseer", "tadribaatuLugha", "lugha", "imlah", "hifz", "tajweed", "tahbeer",
//     "taajiyya", "qiraaha", "nahw", "sarf").error(new Error("subject is inavlid for class specified"))
//     }
//     else if (scores.className ==="tamyidi" || scores.className ==="adonah"|| scores.className ==="rawdoh"){
//     classSubject = Joi.string().required().valid( "hadith", "lugha", "imlah", "hifz", "taajiyya").error(new Error("subject is inavlid for class specified"))
//     }
//     else if (scores.className ==="awwal ibtidahi" || scores.className ==="thaani ibtidahi"|| scores.className ==="thaalith ibtidahi"){
//     classSubject = Joi.string().required().valid("fiqh", "hadith", "tawheed", "tadribaatuLugha", "lugha", "hifz", "tajweed").error(new Error("subject is inavlid for class specified"))
//     }

//     const schema = Joi.object({
//         session: Joi.string().required().error(new Error("session cannot be empty and must be in the format xxxx/yyyy")),
//         term: Joi.string().required().error(new Error("termcannot be empty")),
//         className: Joi.string().required().valid("tamyidi", "rawdoh", "adonah", "awwal ibtidahi", "thaani ibtidahi", "thaalith ibtidahi", "raabi ibtidahi",
//         "khaamis ibtidahi", "awwal idaadi", "thaani idaadi", "thaalith idaadi").error(new Error("please input a valid class name")),
//         subject: Joi.object({
//             subjectName:classSubject,
//             testScore:Joi.number().required().min(0).max(40).error(new Error("test score cannot be empty and must be a number between 0 and 40")),
//             examScore:Joi.number().required().min(0).max(60).error(new Error("exam score cannot be empty and must be a number between 0 and 60")),
//         })
//     }).strict();

//     // dbDebugger(schema.subjects)

//     return schema.validate(scores);
// }

function addScoresValidation(scores) {
  const schema = Joi.object({
    sessionName: Joi.string()
      .required()
      .error(
        new ValidationError("session cannot be empty and must be in the format xxxx/yyyy")
      ),
    termName: Joi.string().required().error(new ValidationError("term cannot be empty")),
    className: Joi.string()
      .required()
      .error(new Error("please input a valid class name")),
    subject: Joi.object({
      subjectName: Joi.string()
        .required()
        .error(
          new ValidationError(
            "session cannot be empty and must be in the format xxxx/yyyy"
          )
        ),
      testScore: Joi.number()
        .required()
        .min(0)
        .max(40)
        .error(
          new Error(
            "test score cannot be empty and must be a number between 0 and 40"
          )
        ),
      examScore: Joi.number()
        .required()
        .min(0)
        .max(60)
        .error(
          new Error(
            "exam score cannot be empty and must be a number between 0 and 60"
          )
        ),
    }),
  }).strict();

  return schema.validate(scores);
}

function addCommentValidation(comment) {
  const schema = Joi.object({
    comment: Joi.string()
      .required()
      .error(
        new ValidationError("Please input the comment")
      ),
    sessionName: Joi.string()
      .required()
      .error(
        new ValidationError("session must be specified")
      ),
    className: Joi.string()
      .required()
      .error(
        new ValidationError("Please input the student's class")
      ),
    termName: Joi.string()
      .required()
      .error(
        new ValidationError("Please specify the term")
      ),
  }).strict();

  // dbDebugger(schema.subjects)

  return schema.validate(comment);
}

module.exports = {
  addScoresValidation,
  addCommentValidation
};

// Joi.string().required().valid("fiqh", "hadith", "tawheed", "tafseer", "tadribaatuLugha", "lugha", "imlah", "hifz", "tajweed", "tahbeer",
//             "taajiyya", "qiraaha", "khatu", "adhkaar", "nahw", "sarf").error(new Error("subject name is inavlid")),
