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
      // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/)
      // .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,25}$/)
      .regex(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$/)
      .messages({ "string.pattern.base": "invalid password" })
      .error(
        new ValidationError(
          "password must be 8 characters or more, with at least one number, a lowercase letter and an uppercase letter"
        )
      ),
    passwordRepeat: Joi.string()
      .required()
      .regex(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$/)
      .messages({ "string.pattern.base": "invalid password" })
      .error(
        new ValidationError(
          "password must be 8 characters or more, with at least one number, a lowercase letter and an uppercase letter"
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
          "Invalid email or password"
        )
      ),
    password: Joi.string()
      .required()
      .min(8)
      .error(
        new ValidationError(
          "Invalid email or password"
        )
      )
  }).strict();

  return schema.validate(user);
}

function forgotPasswordValidator(user) {
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

  return schema.validate(user);
}

function resetPasswordValidator(user) {
  const schema = Joi.object({
    password: Joi.string()
      .required()
      .regex(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$/)
      .messages({ "string.pattern.base": "invalid password" })
      .error(
        new ValidationError(
          "password must be 8 characters or more, with at least one number, a lowercase letter and an uppercase letter"
        )
      )
  }).strict()

  return schema.validate(user);
}



module.exports = { userSignUpValidator, userLogInValidator, forgotPasswordValidator, resetPasswordValidator };