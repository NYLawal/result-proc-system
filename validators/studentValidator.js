const Joi = require("joi");
const { ValidationError } = require("../middleware/errors");
const joiPhoneValidate = Joi.extend(require('joi-phone-number'));
// import JoiMongoId from "joi-objectid"
// const myJoiObjectId = JoiMongoId(Joi)

function newStudentValidation(student) {
  const schema = Joi.object({
    admNo: Joi.string()
      .required()
      .regex(/^MDRS+[0-9]{1,4}|^MDBR+[0-9]{1,4}|^MDUM+[0-9]{1,4}/)
      .messages({ "string.pattern.base": "invalid admission number" }),
    firstName: Joi.string()
      .required()
      .min(3)
      .max(25)
      .error(
        new ValidationError(
          "firstname cannot be empty and must be between 3 and 25 characters"
        )
      ),
    lastName: Joi.string()
      .required()
      .min(3)
      .max(25)
      .error(
        new ValidationError(
          "lastname cannot be empty and must be between 3 and 25 characters"
        )
      ),
    gender: Joi.string().required(),
    entryClass: Joi.string().required(),
    address: Joi.string()
      .required()
      .min(20)
      .max(255)
      .error(new ValidationError("address cannot be empty and must be a valid one")),
      phoneNumber: Joi.string()
      .regex(/^[+0-9]{11,15}$/)
      .required()
      .error(
        new ValidationError(
          "Input a valid phone number, add your country code if not Nigerian"
        )
      ),
    email:Joi.string()
    .email()
    .error(
      new ValidationError(
        "Input a valid email"
      )
    ),
    parentEmail:Joi.string()
    .required()
    .email()
    .error(
      new ValidationError(
        "Input a valid email"
      )
    ),
    stateOfOrigin: Joi.string()
    .required()
    .max(17)
    .error(new ValidationError("state of origin cannot be empty or exceed 17 characters")),
    maritalStatus: Joi.string().required(),
    programme: Joi.string().required(),
    studentStatus: Joi.string(),
    nonStudentStatus: Joi.string(),
    presentClass: Joi.string(),
    classStatus: Joi.string(),
    paymentStatus: Joi.string(),
  }).strict();

  return schema.validate(student);
}


function editStudentValidation(student) {
  const schema = Joi.object({
    admNo: Joi.string()
      .required()
      .regex(/^MDRS+[0-9]{1,4}|^MDBR+[0-9]{1,4}|^MDUM+[0-9]{1,4}/)
      .messages({ "string.pattern.base": "A valid admission number is required for the query" }),
}).strict();

    return schema.validate(student);
  }


function updateStudentValidation(student) {
  const schema = Joi.object({
    admNo: Joi.string()
      .required()
      .regex(/^MDRS+[0-9]{1,4}|^MDBR+[0-9]{1,4}|^MDUM+[0-9]{1,4}/)
      .messages({ "string.pattern.base": "invalid admission number" }),
    firstName: Joi.string()
      .required()
      .min(3)
      .max(25)
      .error(
        new ValidationError(
          "firstname cannot be empty and must be between 3 and 25 characters"
        )
      ),
    lastName: Joi.string()
      .required()
      .min(3)
      .max(25)
      .error(
        new ValidationError(
          "lastname cannot be empty and must be between 3 and 25 characters"
        )
      ),
    gender: Joi.string()
    .required()
    .valid("male","female")
    .error(new ValidationError("input a valid gender")),
    entryClass: Joi.string().required(),
    address: Joi.string()
      .required()
      .min(20)
      .max(255)
      .error(new ValidationError("address cannot be empty and must be a valid one")),
      phoneNumber: Joi.string()
      .regex(/^[+0-9]{11,15}$/)
      .required()
      .error(
        new ValidationError(
         "Input a valid phone number, add your country code if not Nigerian"
        )
      ),
    email:Joi.string()
    .email()
    .error(
      new ValidationError(
        "Input a valid email"
      )
    ),
    parentEmail:Joi.string()
    .required()
    .email()
    .error(
      new ValidationError(
        "Input a valid email"
      )
    ),
    stateOfOrigin: Joi.string()
    .required()
    .max(17)
    .error(new ValidationError("state of origin cannot be empty or exceed 17 characters")),
    maritalStatus: Joi.string()
    .required()
    .valid("single","married")
    .error(new ValidationError("input a valid marital status")),
    programme: Joi.string().required()
    .error(new ValidationError("input the programme the student is enrolled in")),
  }).strict();

  return schema.validate(student);
}


module.exports = {
  newStudentValidation,
  updateStudentValidation,
  editStudentValidation
};

