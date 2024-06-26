const dbDebugger = require("debug")("app:db");
const Student = require("../models/studentModel");
const Staff = require("../models/staffModel");
const Score = require("../models/scoreModel");
const {
  newStudentValidation,
  updateStudentValidation,
  editStudentValidation
} = require("../validators/studentValidator");

const { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } =
  require('../middleware/errors')

const classes = require("../models/classModel");
// const asyncWrapper = require('../middleware/async')

const addStudent = async (req, res, next) => {
  const { error } = newStudentValidation(req.body);
  if (error) throw error;

  if (req.body.email !== "nothing@nil.com") {
    const emailExists = await Student.findOne({ email: req.body.email });
    if (emailExists) throw new BadUserRequestError("Error: An account with this email already exists");
  }
  const admnoExists = await Student.findOne({ admNo: req.body.admNo });
  if (admnoExists) throw new BadUserRequestError("Error: A student with this admission number already exists");

  const student = await Student.create(req.body);
  res.status(201).json({ status: "success", student, message: "Student added successfully" });
};

// check if page returned is the last
function getEndOfPage(studNum, pgSize) {
  let lastpage;
  const wholediv = Math.floor(studNum / pgSize);
  const modulus = studNum % pgSize;
  if (modulus == 0) lastpage = wholediv;
  else lastpage = wholediv + 1;
  // console.log(lastpage)
  return lastpage
}

const getStudents = async (req, res, next) => {
  let pageNumber = +req.params.page || 1;
  const pageSize = 5;
  let queryObject = req.query;

  const { admNo, firstName, lastName, gender, address, entryClass, stateOfOrigin, maritalStatus, programme, presentClass, classStatus, studentStatus, paymentStatus } = req.query;
  // let queryObject = {};

  if (admNo) {
    queryObject.admNo = admNo;
  }
  if (firstName) {
    queryObject.firstName = { $regex: firstName, $options: "i" };
  }
  if (lastName) {
    queryObject.lastName = { $regex: lastName, $options: "i" };
  }
  if (entryClass) {
    queryObject.entryClass = entryClass;
  }
  if (gender) {
    queryObject.gender = gender;
  }
  if (address) {
    queryObject.address = { $regex: address, $options: "i" };
  }
  if (stateOfOrigin) {
    queryObject.stateOfOrigin = { $regex: stateOfOrigin, $options: "i" };
  }
  if (maritalStatus) {
    queryObject.maritalStatus = maritalStatus;
  }
  if (presentClass) {
    queryObject.presentClass = presentClass;
  }
  if (programme) {
    queryObject.programme = programme;
  }
  if (classStatus) {
    queryObject.classStatus = classStatus;
  }
  if (studentStatus) {
    queryObject.studentStatus = studentStatus;
  }
  if (paymentStatus) {
    queryObject.paymentStatus = paymentStatus;
  }
  if (Object.keys(queryObject).length === 0)
    return next(new Error("Error: no such criteria exists"));

  const students = await Student.find(queryObject)
  const noOfStudents = students.length;
  const studentsperpage = await Student.find(queryObject)
    .sort({ admNo: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  if (students.length == 0)
    return next(new Error("Error: no such students found"));

  const pgnum = getEndOfPage(noOfStudents, pageSize)

  for (let i = 0; i < studentsperpage.length; i++) {
    let date = studentsperpage[i].registeredOn.toString()
    let dateonly = date.split(' ')
    studentsperpage[i].dateOfRegistration = dateonly[0] + " " + dateonly[1] + " " + dateonly[2] + " " + dateonly[3]

    let serialno = (pageSize * pageNumber) - (pageSize - (i + 1))
    studentsperpage[i].serialNo = serialno;
  }
  res
    .status(200)
    .json({ status: "Success", studentsperpage, noOfStudents, page: pageNumber, pgnum });
};

const getStudentsByClass = async (req, res, next) => {
  let pageNumber = +req.params.page || 1;
  const pageSize = 5;

  const teacher = await Staff.findOne({ email: req.user.email })
  const teacherClass = teacher.teacherClass
  const teacherProgramme = teacher.teacherProgramme

  const students = await Student.find({ $and: [{ presentClass: teacherClass }, { programme: teacherProgramme }] })
  const noOfStudents = students.length;
  const studentsperpage = await Student.find({ $and: [{ presentClass: teacherClass }, { programme: teacherProgramme }] })
    .sort({ admNo: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  if (students.length == 0)
    return next(new Error("Error: no students found"));

  // const admissionNumbers = students.admNo

  const pgnum = getEndOfPage(noOfStudents, pageSize)

  for (let i = 0; i < studentsperpage.length; i++) {
    // let date = studentsperpage[i].registeredOn.toString()
    // let dateonly = date.split(' ')
    // studentsperpage[i].dateOfRegistration = dateonly[0] + " " + dateonly[1]  + " " + dateonly[2]  + " " + dateonly[3]
    let serialno = (pageSize * pageNumber) - (pageSize - (i + 1))
    studentsperpage[i].serialNo = serialno;
  }
 
  res
    .status(200)
    .json({ status: "Success", students, studentsperpage, noOfStudents, page: pageNumber, pgnum });
};


const getOneStudent = async (req, res, next) => {
  const { admNo } = req.query;
  const student = await Student.findOne({ admNo });
  dbDebugger(student);
  if (!student) return next(new Error("Error: no such student found"));
  res.status(200).json({ status: "success", student, msg: "student found!" });
};


const getAllStudents = async (req, res, next) => {
  let pageNumber = +req.params.page || 1
  const pageSize = 5;

  const students = await Student.find({ studentStatus: "current" })
  const noOfStudents = students.length;
  if (!students) return next(new Error("Error: no students found"));

  const studentsperpage = await Student.find({ studentStatus: "current" })
    .sort({ admNo: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  const pgnum = getEndOfPage(noOfStudents, pageSize)

  for (let i = 0; i < studentsperpage.length; i++) {
    let date = studentsperpage[i].registeredOn.toString()
    let dateonly = date.split(' ')
    studentsperpage[i].dateOfRegistration = dateonly[0] + " " + dateonly[1] + " " + dateonly[2] + " " + dateonly[3]

    let serialno = (pageSize * pageNumber) - (pageSize - (i + 1))
    studentsperpage[i].serialNo = serialno;
  }
  res.status(200).json({ status: "success", studentsperpage, noOfStudents, page: pageNumber, pgnum });
};


const editStudent = async (req, res, next) => {
  const { error } = editStudentValidation(req.body);
  if (error) throw error;

  let { admNo } = req.body;
  const student = await Student.findOne({ admNo })
  if (!student) return next(new Error("Error: no such student found"));

  res
    .status(200)
    .json({ status: "success", message: "Student found", student });
};


const updateStudent = async (req, res, next) => {
  const { error } = updateStudentValidation(req.body);
  if (error) throw error;

  let { admNo } = req.body;
  const student = await Student.findOneAndUpdate({ admNo }, req.body, { new: true })
  if (!student) return next(new Error("Error: no such student found"));

  res
    .status(200)
    .json({ status: "success", message: "Student information is up-to-date", student });
};


const updateStatus = async (req, res, next) => {
  let { admNo } = req.query;
  let nonStudentStatus = req.body.status
  const student = await Student.findOneAndUpdate({ admNo }, {studentStatus: "past", nonStudentStatus}, { new: true })
  if (!student) return next(new Error("Error: no such student found"));

  res
    .status(200)
    .json({ status: "success", message: "Student's status has been updated", student });
};


const promoteStudents = async (req, res, next) => {
  const { termName, sessionName } = req.body;
  const termRequest = await Score.find(
    {
      $and:
        [
          { "scores.sessionName": sessionName },
          { "scores.term.termName": termName },
        ]
    })
  if (termRequest.length == 0) throw new NotFoundError("Error: this term has no registered scores");

  console.log(termRequest.length)
  for (let i = 0; i < termRequest.length; i++) {
    const requestedsession = termRequest[i].scores.find(asession => asession.sessionName == sessionName)
    const requestedterm = requestedsession.term.find(aterm => aterm.termName == termName)
    const avgpercent = requestedterm.avgPercentage
   
    if (avgpercent < 50) {
      await Student.findOneAndUpdate({ admNo: termRequest[i].admissionNumber }, { classStatus: "repeated" }, { new: true })
    }
    else if (avgpercent >= 50) {
      const student = await Student.findOne({ admNo: termRequest[i].admissionNumber })

      switch (student.presentClass) {
        case "tamyidi":
          student.presentClass = "adonah"
          break;
        case "adonah":
          student.presentClass = "rawdoh"
          break;
        case "rawdoh":
          student.presentClass = "awwal ibtidaahi"
          break;
        case "awwal ibtidaahi":
          student.presentClass = "thaani ibtidaahi"
          break;
        case "thaani ibtidaahi":
          student.presentClass = "thaalith ibtidaahi"
          break;
        case "thaalith ibtidaahi":
          student.presentClass = "raabi ibtidaahi"
          break;
        case "raabi ibtidaahi":
          student.presentClass = "khaamis ibtidaahi"
          break;
        case "khaamis ibtidaahi":
          student.presentClass = "awwal idaadi"
          break;
        case "awwal idaadi":
          student.presentClass = "thaani idaadi"
          break;
        case "thaani idaadi":
          student.presentClass = "thaalith idaadi"
          break;
        case "thaalith idaadi":
          student.studentStatus = "past"
          break;
        // default:  
      }
      student.classStatus = "promoted"
      await student.save()
    }

  }
  res.status(200).json({ status: "success", message: "Students have been successfully promoted" });
};

const deleteStudent = async (req, res, next) => {
  let { admNo } = req.query;
  const student = await Student.findOneAndDelete({ admNo });
  if (!student) return next(new Error("Error: no such student found"));

  res.status(200).json({ status: "success", msg: "user deleted successfully" });
};


module.exports = {
  addStudent,
  getStudents,
  getOneStudent,
  getStudentsByClass,
  getAllStudents,
  editStudent,
  updateStudent,
  updateStatus,
  promoteStudents,
  deleteStudent,
};

