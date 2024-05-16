const Joi = require("joi");
const { ValidationError } = require("../middleware/errors");
const joiPhoneValidate = Joi.extend(require('joi-phone-number'));

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
      .error(
        new ValidationError(
          "Teacher must have a class"
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
  
  
    module.exports = { addStaffValidator };