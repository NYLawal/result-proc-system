const Joi = require("joi");
const { ValidationError } = require("../middleware/errors");
const joiPhoneValidate = Joi.extend(require('joi-phone-number'));

function userSignUpValidator(user) {
    const schema = Joi.object({
      email: Joi.string()
        .required()
        .email()
        .error(
          new ValidationError(
            "please input a valid email"
          )
        ),
      password: Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/)
        .messages({ "string.pattern.base": "invalid password" })
        .error(
          new ValidationError(
            "password must be between 8 and 25 characters with at least one number, a lowercase letter, an uppercase letter"
          )
        ),  
        passwordRepeat: Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/)
        .messages({ "string.pattern.base": "invalid password" })
        .error(
          new ValidationError(
            "password must be between 8 and 25 characters with at least one number, a lowercase letter, an uppercase letter"
          )
        ),  
    }).strict();
  
    return schema.validate(user);
  }


  function userLogInValidator(user) {
    const schema = Joi.object({
      email: Joi.string()
        .required()
        .email()
        .error(
          new ValidationError(
            "Please input a valid email"
          )
        ),
        password: Joi.string()
        .required()
        .min(8)
        .max(25)
        .error(
          new ValidationError(
            "Input a valid password"
          )
        )
    }).strict();
  
    return schema.validate(user);
}

function forgotPasswordValidator(user){
const schema = Joi.object({
  email:Joi.string()
  .required()
  .email()
  .error(
    new ValidationError(
      "Input a valid email"
    )
  ),
}).strict()

return schema.validate(user);
}

function resetPasswordValidator(user) {
  const schema = Joi.object({
  // email:Joi.string()
  // .required()
  // .email()
  // .error(
  //   new ValidationError(
  //     "please input a valid email"
  //   )
  // ),
  password: Joi.string()
  .required()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/)
  .messages({ "string.pattern.base": "invalid password" })
  .error(
    new ValidationError(
      "password must be between 8 and 25 characters with at least one number, a lowercase letter, an uppercase letter"
    )
  )
}).strict()

return schema.validate(user);
}

function addStaffValidator(staffer){
  const schema = Joi.object({
    stafferName:Joi.string()
    .required()
    .error(
      new ValidationError(
        "Staffer name cannot be empty"
      )
    ),
    email:Joi.string()
    .required()
    .email()
    .error(
      new ValidationError(
        "Input a valid email"
      )
    ),
    gender:Joi.string()
    .required()
    .error(
      new ValidationError(
        "Staffer must have a gender"
      )
    ),
    address:Joi.string()
    .required()
    .error(
      new ValidationError(
        "Staffer must have an address"
      )
    ),
    phoneNumber: joiPhoneValidate.string()
    .required()
    .phoneNumber({ format: "international",
    strict: true, })
    .error(
      new ValidationError(
        "please input a valid phone number with valid country code"
      )
    ),
    teacherClass:Joi.string()
    .required()
    .error(
      new ValidationError(
        "Staffer must have a class"
      )
    ),
    role:Joi.string()
    .required()
    .error(
      new ValidationError(
        "Staffer must have a role"
      )
    ),
  }).strict()
  
  return schema.validate(staffer);
  }


  module.exports = {userSignUpValidator, userLogInValidator, forgotPasswordValidator, resetPasswordValidator, addStaffValidator};