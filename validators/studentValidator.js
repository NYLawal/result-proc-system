const Joi = require("joi");
const { ValidationError } = require("../middleware/errors");
const joiPhoneValidate = Joi.extend(require('joi-phone-number'));
// import JoiMongoId from "joi-objectid"
// const myJoiObjectId = JoiMongoId(Joi)

function newStudentValidation(student) {
  const schema = Joi.object({
    admNo: Joi.string()
      .required()
      .regex(/^MDRS+[0-9]{1,4}/)
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
    phoneNumber: joiPhoneValidate.string()
    .required()
    .phoneNumber({ format: "international",
    strict: true, })
    .error(
      new ValidationError(
        "please input a valid phone number with valid country code"
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
    .max(10)
    .error(new ValidationError("state of origin cannot be empty or exceed 10 characters")),
    maritalStatus: Joi.string().required(),
    studentStatus: Joi.string(),
    nonStudentStatus: Joi.string(),
    presentClass: Joi.string(),
    classStatus: Joi.string(),
    paymentStatus: Joi.string(),
  }).strict();

  return schema.validate(student);
}

function updateStudentValidation(student) {
  const schema = Joi.object({
    admNo: Joi.string()
      .optional()
      .regex(/^RSM+[0-9]{1,4}/)
      .messages({ "string.pattern.base": "invalid admission number" }),
    firstName: Joi.string()
      .optional()
      .min(3)
      .max(25)
      .error(
        new Error(
          "firstname cannot be empty and must be between 3 and 25 characters"
        )
      ),
    lastName: Joi.string()
      .optional()
      .min(3)
      .max(25)
      .error(
        new Error(
          "lastname cannot be empty and must be between 3 and 25 characters"
        )
      ),
    age: Joi.number()
      .min(4)
      .max(25)
      .error(new Error("a student can only be between 4 and 25 years old")),
    address: Joi.string()
      .optional()
      .min(20)
      .max(255)
      .error(new Error("address cannot be empty and must be a valid one")),
    parentContact: Joi.string()
      .optional()
      .min(11)
      .max(11)
      .error(
        new Error("input a correct phone number of 11 digits. starting with 0")
      ),
    status: Joi.string().optional(),
  }).strict();

  return schema.validate(student);
}


module.exports = {
  newStudentValidation,
  updateStudentValidation,
};
// exports.validate = newStudentValidation;
