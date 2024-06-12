const sClass = require("../models/classModel");
const { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } =
  require('../middleware/errors')

const { addStudent } = require("./studentController");
const { model } = require("mongoose");

const getClassSubjects = async (req, res, next) => {
  const {className, programme} = req.query;
  const classExists = await sClass.findOne({
  $and:
  [
    {className},
    {programme}
  ]
})
// console.log(classExists)
if (!classExists) throw new NotFoundError("Error: this class has no registered subjects");
res.status(200).json({ status: "success", message: "successful", classExists });
}


const addClassSubject = async (req, res, next) => {
  const {className, programme} = req.query;
  const {subject} =req.body;
  const classExists = await sClass.findOne({
  $and:
  [
    {className},
    {programme}
  ]
})
// console.log(req.body)
if (!classExists) throw new NotFoundError("Error: the requested class does not exist");
for (let count=0; count<classExists.subjects.length; count++){
  if (classExists.subjects[count] == subject)
    throw new BadUserRequestError(`Error: ${subject} already exists as a subject for ${className}`);
}
classExists.subjects.push(subject);
classExists.save();
res.status(200).json({ status: "success", message: `${subject} has been added successfully for ${className}`, classExists });
}


const removeClassSubject = async (req, res, next) => {
  const {className, programme} = req.query;
  const {subject} = req.body;
  const classExists = await sClass.findOne({
  $and:
  [
    {className},
    {programme}
  ]
})
// console.log(req.body)
if (!classExists) throw new NotFoundError("Error: the requested class does not exist");
for (let count=0; count<classExists.subjects.length; count++){
  if (classExists.subjects[count] == subject){
    classExists.subjects.splice(count,1);
    classExists.save();
  return res.status(200).json({ status: "success", message: `${subject} has been removed successfully for ${className}`, classExists });
}
}
throw new BadUserRequestError(`Error: ${subject} does not exist as a subject for ${className}`);

}



module.exports = {getClassSubjects, addClassSubject, removeClassSubject}
