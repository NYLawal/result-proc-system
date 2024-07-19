const Joi = require("joi");
const { ValidationError } = require("../middleware/errors");
const joiPhoneValidate = Joi.extend(require('joi-phone-number'));

function addStaffValidator(staffer) {
  const schema = Joi.object({
    stafferName: Joi.string()
      .required()
      .error(
        new ValidationError(
          "Staffer name cannot be empty"
        )
      ),
    email: Joi.string()
      .required()
      .email()
      .error(
        new ValidationError(
          "Input a valid email"
        )
      ),
    gender: Joi.string()
      .required()
      .error(
        new ValidationError(
          "Staffer must have a gender"
        )
      ),
    address: Joi.string()
      .required()
      .error(
        new ValidationError(
          "Staffer must have an address"
        )
      ),
    phoneNumber: joiPhoneValidate.string()
      .required()
      .phoneNumber({
        format: "international",
        strict: true,
      })
      .error(
        new ValidationError(
          "please input a valid phone number with valid country code"
        )
      ),
    teacherClass: Joi.string()
      .error(
        new ValidationError(
          "Teacher must have a class"
        )
      ),
    teacherProgramme: Joi.string()
      // Joi.array().items(Joi.string())
      .error(
        new ValidationError(
          "Teacher must have a programme"
        )
      ),
    role: Joi.string()
      .required()
      .error(
        new ValidationError(
          "Staffer must have a role"
        )
      ),
  }).strict()

  return schema.validate(staffer);
}


function editStaffQueryValidator(staffer) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .error(
        new ValidationError(
          "Input a valid email"
        )
      ),
  }).strict()

  return schema.validate(staffer);
}


function updateStaffValidator(staffer) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .error(
        new ValidationError(
          "Email is required, click on 'edit > staffer' on the side bar to input the staffer's email"
        )
      ),
    stafferName: Joi.string()
      .required()
      .error(
        new ValidationError(
          "Staffer name cannot be empty"
        )
      ),
    gender: Joi.string()
      .required()
      .error(
        new ValidationError(
          "Staffer must have a gender"
        )
      ),
    address: Joi.string()
      .required()
      .error(
        new ValidationError(
          "Staffer must have an address"
        )
      ),
    phoneNumber: joiPhoneValidate.string()
      .required()
      .phoneNumber({
        format: "international",
        strict: true,
      })
      .error(
        new ValidationError(
          "please input a valid phone number with valid country code"
        )
      ),
    teacherClass: Joi.string(),
    teacherProgramme: Joi.string(),
    role: Joi.string()
      .required()
      .valid("superadmin","admin","bursar","teacher")
      .error(
        new ValidationError(
          "Staffer must have a valid role (superadmin, admin, bursar or teacher)"
        )
      ),
    other_role: Joi.string()
      .required()
      .valid("admin","bursar","teacher","parent","student", "nil")
      .error(
        new ValidationError(
          "Staffer must have a valid role (admin, bursar, parent, student, teacher or nil)"
        )
      ),
  }).strict()

  return schema.validate(staffer);
}


function deleteStaffValidator(staffer) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .error(
        new ValidationError(
          " Staffer email is required for the query"
        )
      ),
  }).strict()

  return schema.validate(staffer);
}

module.exports = { addStaffValidator, editStaffQueryValidator, updateStaffValidator, deleteStaffValidator };