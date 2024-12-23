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
      .min(8)
      .max(25)
      .error(
        new ValidationError(
          "password must be between 8 and 25 characters"
        )
      ),
    passwordRepeat: Joi.string()
      .required()
      .min(8)
      .max(25)
      .error(
        new ValidationError(
          "password must be between 8 and 25 characters"
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
      .min(8)
      .max(25)
      .error(
        new ValidationError(
          "password must be between 8 and 25 characters"
        )
      )
  }).strict()

  return schema.validate(user);
}



module.exports = { userSignUpValidator, userLogInValidator, forgotPasswordValidator, resetPasswordValidator };