const Attendance = require("../models/attendanceModel");
const { BadUserRequestError, NotFoundError, UnAuthorizedError } =
    require('../middleware/errors')


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
                        { student_name: req.body[count].student_name },
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
                }
                else { // if session requested seen
                    const termMatch = studentExists.attendanceRecord[recordcount].term.find(aterm => aterm.termName == termName)
                    if (!termMatch) { //term not seen

                        let termOfSession = {
                            termName,
                            attendance: dayattendance

                        }
                        studentExists.attendanceRecord[recordcount].term.push(termOfSession)
                        studentExists.save()
                    }
                    else { // term seen
                        for (let atdcount = 0; atdcount < termMatch.attendance.length; atdcount++) {
                            if (termMatch.attendance[atdcount].termdate == req.body[count].termdate) { throw new BadUserRequestError("Error: attendance already exists for this date") }
                        }

                        termMatch.attendance.push(dayattendance)
                        studentExists.save()
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
        if (isValidStaff.teacherProgramme != isStudent.programme) {
            throw new UnAuthorizedError("Error: Sorry, you are not allowed to view attendance for students of other programmes")
        }
    }
    if (req.user.role == "parent") {
        if (req.user.email != isStudent.parentEmail)
            throw new BadUserRequestError("Error: you do not have access to this report. Input your ward's admission number");
    }
    if (req.user.other_role == "parent") {
        const isSameClass = await Staff.findOne({ email: req.user.email })
        if (isSameClass.teacherClass != isStudent.presentClass && req.user.email != isStudent.parentEmail)
            throw new BadUserRequestError("Error: you do not have access to this report. You're only able to view for your ward(s) or your students");
    }
    if (req.user.role == "student") {
        const isValidStudent = await Student.findOne({ email: req.user.email })
        if (admNo != isValidStudent.admNo)
            throw new BadUserRequestError("Error: you do not have access to this report. Input your admission number.");
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
    }

    return res.status(200).json({
        status: "success",
        termName,
        className,
        sessionName,
        attendanceExists
    });
}

const deleteAttendance = async (req, res, next) => {
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


module.exports = { markAttendance, getAttendance, deleteAttendance }