const Joi =require("joi");
// import JoiMongoId from "joi-objectid"
// const myJoiObjectId = JoiMongoId(Joi)

function validateNewStudent(student){
    const schema = Joi.object({
     admNo: Joi.string().required().regex(/^RSM00+[1-9]{1,4}/)
     .messages({'string.pattern.base': 'invalid admission number',}),
     firstName: Joi.string().required().min(3).max(25).error(new Error('firstname cannot be empty and must be between 3 and 25 characters')),
     lastName: Joi.string().required().min(3).max(25).error(new Error('lastname cannot be empty and must be between 3 and 25 characters')),
     age: Joi.number()
     .min(4)
     .max(25)
     .error(new Error('a student can only be between 4 and 25 years old')),
     address: Joi.string().required().min(20).max(255).error(new Error('address cannot be empty and must be a valid one')),
     parentContact: Joi.string()
     .required()
     .min(11)
     .max(11)
     .error(new Error('input a correct phone number of 11 digits. starting with 0')),
     status: Joi.string().required()
 
  }).strict()

  return schema.validate(student)
}

module.exports = validateNewStudent;
// exports.validate = validateNewStudent;
