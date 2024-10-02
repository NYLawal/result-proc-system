const Attendance = require("../models/attendanceModel");
const Staff = require("../models/staffModel");
const Student = require("../models/studentModel");
const { BadUserRequestError, NotFoundError, UnAuthorizedError } =
    require('../middleware/errors');


const markAttendance = async (req, res, next) => {
    const { className, termName, sessionName, programme } = req.query;

    for (let count = 0; count < req.body.length; count++) {
        let dayattendance = {
            termdate: req.body[count].termdate,
            presence: req.body[count].presence,
        }
        const studentExists = await Attendance.findOne(
            {
                $and:
                    [
                        { admissionNumber: req.body[count].admissionNumber },
                        // { student_name: req.body[count].student_name },
                        { programme }
                    ]
            })
        if (!studentExists) {
            const addStudent = await Attendance.create({ admissionNumber: req.body[count].admissionNumber, student_name: req.body[count].student_name, programme });

            let timeOfYear = {
                sessionName,
                className,
                term: {
                    termName,
                    attendance: dayattendance
                }
            }
            addStudent.attendanceRecord.push(timeOfYear)
            addStudent.save()
        }

        else { // student has attendance record
            // update student's name in attendance database
            if (studentExists.student_name != req.body[count].student_name) studentExists.student_name = req.body[count].student_name

            for (let recordcount = 0; recordcount < studentExists.attendanceRecord.length; recordcount++) {
                const sessionMatch = studentExists.attendanceRecord.find(asession => asession.sessionName == sessionName)
                if (!sessionMatch) { // if session requested not seen
                    let timeOfYear = {
                        sessionName,
                        className,
                        term: {
                            termName,
                            attendance: dayattendance
                        }
                    }
                    studentExists.attendanceRecord.push(timeOfYear)
                    studentExists.save()
                    break;
                }
                else { // if session requested seen
                    const termMatch = sessionMatch.term.find(aterm => aterm.termName == termName)
                    if (!termMatch) { //term not seen
                        let termOfSession = {
                            termName,
                            attendance: dayattendance
                        }
                        sessionMatch.term.push(termOfSession)
                        studentExists.save()
                        break;
                    }
                    else { // term seen
                        for (let atdcount = 0; atdcount < termMatch.attendance.length; atdcount++) {
                            if (termMatch.attendance[atdcount].termdate == req.body[count].termdate) { throw new BadUserRequestError("Error: attendance already exists for this date") }
                        }
                        termMatch.attendance.push(dayattendance)
                        studentExists.save()
                        break;
                    }
                }
            }
        }
    }
    return res.status(200).json({ status: "Success", message: `attendance updated successfully` });
}

const getAttendance = async (req, res, next) => {
    const { termName, sessionName, className, programme } = req.query;

    if (req.user.role == "admin") {
        const isValidStaff = await Staff.findOne({ email: req.user.email })
        if (isValidStaff.teacherProgramme != programme) {
            throw new UnAuthorizedError("Error: Sorry, you are not allowed to view attendance for students of other programmes")
        }
    }

    const attendanceExists = await Attendance.find({
        $and: [
            { programme },
            { "attendanceRecord.sessionName": sessionName },
            { "attendanceRecord.className": className },
        ]
    })
    if (attendanceExists.length == 0) throw new NotFoundError("Error: the requested class attendance does not exist");

    //get attendance
    for (let recordcount = 0; recordcount < attendanceExists.length; recordcount++) {
        let studentAtd = attendanceExists[recordcount].attendanceRecord // attendance record for the student for all sessions available
        let sessionAttendance = studentAtd.find(asession => asession.sessionName == sessionName)
        let termRequested = sessionAttendance.term.find(aterm => aterm.termName == termName)
        if (!termRequested) throw new NotFoundError("Error: attendance does not exist for this term");
        if (termRequested.attendance.length == 0) throw new NotFoundError("Error: no attendance has been recorded for this term");
    }

    return res.status(200).json({
        status: "success",
        termName,
        className,
        sessionName,
        attendanceExists
    });
}

const getOneAttendance = async (req, res, next) => {
    const { admissionNumber, termName, sessionName } = req.query;
    const isStudent = await Student.findOne({ admNo: admissionNumber })

    if (req.user.role == "parent") {
        if (req.user.email != isStudent.parentEmail)
            throw new BadUserRequestError("Error: you do not have access to this report. Input your ward's admission number");
    }
    if (req.user.other_role == "parent") {
        const isSameClass = await Staff.findOne({ email: req.user.email })
        if (isSameClass.teacherClass != isStudent.presentClass && req.user.email != isStudent.parentEmail)
            throw new BadUserRequestError("Error: you do not have access to this report. Ensure you have inputted the correct admission number");
    }

    const attendanceExists = await Attendance.findOne({ admissionNumber })
    if (!attendanceExists) throw new NotFoundError("Error: the requested attendance does not exist");
    //get attendance
    let studentAtd = attendanceExists.attendanceRecord // attendance record for the student for all sessions available
    let sessionAttendance = studentAtd.find(asession => asession.sessionName == sessionName)
    if (!sessionAttendance) throw new NotFoundError("Error: attendance no longer exists for this session");
    let termRequested = sessionAttendance.term.find(aterm => aterm.termName == termName)
    if (!termRequested) throw new NotFoundError("Error: attendance does not exist for this term");
    if (termRequested.attendance.length == 0) throw new NotFoundError("Error: no attendance has been recorded for this term");

    res.status(200).json({
        status: "success",
        message: "Successful",
        attendanceExists
    });
}

const editAttendanceDate = async (req, res, next) => {
    const { className, termName, sessionName, programme, prevDate } = req.query;
    const { newDate } = req.body;

    if (req.user.role == "admin") {
        const isValidStaff = await Staff.findOne({ email: req.user.email })
        if (isValidStaff.teacherProgramme != isStudent.programme) {
            throw new UnAuthorizedError("Error: Sorry, you are not allowed to edit attendance for students of other programmes")
        }
    }

    const attendanceExists = await Attendance.find({
        $and: [
            { programme },
            { "attendanceRecord.sessionName": sessionName },
            { "attendanceRecord.className": className },
        ]
    })
    if (attendanceExists.length == 0) throw new NotFoundError("Error: the requested attendance does not exist");
    //get attendance
    for (let recordcount = 0; recordcount < attendanceExists.length; recordcount++) {
        let studentAtd = attendanceExists[recordcount].attendanceRecord // attendance record for the student for all sessions available
        let sessionAttendance = studentAtd.find(asession => asession.sessionName == sessionName)
        let termRequested = sessionAttendance.term.find(aterm => aterm.termName == termName)
        if (termRequested) {
            let daterequest = termRequested.attendance.find(adate => adate.termdate == prevDate)
            // if date does not exist in student attendance record
            if (!daterequest) throw new NotFoundError("Error: date cannot be found in the register");
            console.log(daterequest)
            console.log(daterequest.termdate)
            daterequest.termdate = newDate
            attendanceExists[recordcount].save()
        }
    }

    res.status(200).json({
        status: "success",
        message: `attendance date for ${prevDate} is successfully changed`,
        attendanceExists
    });
}

const editAttendanceStatus = async (req, res, next) => {
    const { termName, sessionName, className, programme, admissionNumber } = req.query;
    const { attendanceDate } = req.body;

    if (req.user.role == "admin") {
        const isValidStaff = await Staff.findOne({ email: req.user.email })
        if (isValidStaff.teacherProgramme != isStudent.programme) {
            throw new UnAuthorizedError("Error: Sorry, you are not allowed to edit attendance for students of other programmes")
        }
    }

    const attendanceExists = await Attendance.findOne({
        $and: [
            { admissionNumber },
            { programme },
            { "attendanceRecord.sessionName": sessionName },
            { "attendanceRecord.className": className },
        ]
    })

    if (!attendanceExists) throw new NotFoundError("Error: the requested attendance does not exist");
    //get attendance
    let studentAtd = attendanceExists.attendanceRecord // attendance record for the student for all sessions available
    let sessionAttendance = studentAtd.find(asession => asession.sessionName == sessionName)
    let termRequested = sessionAttendance.term.find(aterm => aterm.termName == termName)
    if (termRequested) {
        let daterequest = termRequested.attendance.find(adate => adate.termdate == attendanceDate)
        console.log(daterequest)
        // if date does not exist in student attendance record
        if (!daterequest) throw new NotFoundError("Error: date cannot be found in the register");
        if (daterequest.presence == "yes") daterequest.presence = "no"
        else if (daterequest.presence == "no") daterequest.presence = "yes"
        attendanceExists.save()
    }

    res.status(200).json({
        status: "success",
        message: `The student's attendance status for ${attendanceDate} is successfully changed`,
        attendanceExists
    });
}

const deleteDayAttendance = async (req, res, next) => {
    const { className, termName, sessionName, programme, atdDate } = req.query;

    if (req.user.role == "admin") {
        const isValidStaff = await Staff.findOne({ email: req.user.email })
        if (isValidStaff.teacherProgramme != isStudent.programme) {
            throw new UnAuthorizedError("Error: Sorry, you are not allowed to delete attendance for students of other programmes")
        }
    }

    const attendanceExists = await Attendance.find({
        $and: [
            { programme },
            { "attendanceRecord.sessionName": sessionName },
            { "attendanceRecord.className": className },
        ]
    })
    if (attendanceExists.length == 0) throw new NotFoundError("Error: the requested attendance does not exist");
    //get attendance
    for (let recordcount = 0; recordcount < attendanceExists.length; recordcount++) {
        let studentAtd = attendanceExists[recordcount].attendanceRecord // attendance record for the student for all sessions available
        let sessionAttendance = studentAtd.find(asession => asession.sessionName == sessionName)
        let termRequested = sessionAttendance.term.find(aterm => aterm.termName == termName)
        if (termRequested) {
            let daterequest = termRequested.attendance.find(adate => adate.termdate == atdDate)
            // if date does not exist in student attendance record
            if (!daterequest) throw new NotFoundError("Error: date cannot be found in the register");
            termRequested.attendance.splice(termRequested.attendance.indexOf(daterequest), 1)
            attendanceExists[recordcount].save()
        }
    }

    res.status(200).json({
        status: "success",
        message: `attendance for ${atdDate} is successfully deleted`,
        attendanceExists
    });
}

const deleteTermAttendance = async (req, res, next) => {
    const { termName, sessionName, programme } = req.query;

    if (req.user.role == "admin") {
        const isValidStaff = await Staff.findOne({ email: req.user.email })
        if (isValidStaff.teacherProgramme != isStudent.programme) {
            throw new UnAuthorizedError("Error: Sorry, you are not allowed to delete attendance for students of other programmes")
        }
    }

    const attendanceExists = await Attendance.find({
        $and: [
            { programme },
            { "attendanceRecord.sessionName": sessionName }
        ]
    })
    if (attendanceExists.length == 0) throw new NotFoundError("Error: the requested attendance does not exist");
    let attendanceCount = 0;
    //get attendance
    for (let recordcount = 0; recordcount < attendanceExists.length; recordcount++) {
        let studentAtd = attendanceExists[recordcount].attendanceRecord // attendance record for the student for all sessions available
        let sessionAttendance = studentAtd.find(asession => asession.sessionName == sessionName)
        let termRequested = sessionAttendance.term.find(aterm => aterm.termName == termName)
        if (termRequested) {
            attendanceCount++;
            sessionAttendance.term.splice(sessionAttendance.term.indexOf(termRequested), 1)
            // if attendance exists for no term in the session, delete the session from student attendance record
            if (sessionAttendance.term.length == 0) studentAtd.splice(studentAtd.indexOf(sessionAttendance), 1)
            attendanceExists[recordcount].save()
        }
    }
    if (attendanceCount == 0) throw new NotFoundError("Error: attendance does not exist for this term");

    return res.status(200).json({
        status: "success",
        message: `${programme} attendance for ${termName} term ${sessionName} is successfully deleted`,
        attendanceCount,
        attendanceExists
    });
}



module.exports = { markAttendance, getAttendance, getOneAttendance, editAttendanceDate, editAttendanceStatus, deleteDayAttendance, deleteTermAttendance }