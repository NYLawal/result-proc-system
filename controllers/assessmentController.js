const Assessment = require("../models/assessmentModel");
const Quiz = require("../models/quizmodel");
const { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } =
    require('../middleware/errors')

const setAssessment = async (req, res, next) => {
    const { className, programme, assessmentLink, lessonLink, subjectName } = req.body;
    let newlesson = {
        subjectName,
        lessonLink,
        assessmentLink
    }
    const assessmentPresent = await Assessment.findOne({ $and: [{ className }, { programme }] });
    if (assessmentPresent) {
        for (let i = 0; i < assessmentPresent.lesson.length; i++) {
            if (subjectName == assessmentPresent.lesson[i].subjectName) {
                throw new BadUserRequestError(`Error: An assessment is already set for this subject. You can delete it or wait for it to expire`);
            }
        }
        assessmentPresent.lesson.push(newlesson)
        assessmentPresent.save()
        return res.status(200).json({ status: "success", assessmentPresent, message: "Lesson/assessment set successfully!" });
    }
    const setSuccess = await Assessment.create(req.body);
    setSuccess.lesson.push(newlesson)
    setSuccess.save()
    res.status(201).json({ status: "success", setSuccess, message: "Lesson/assessment set successfully!" });
};

const editAssessment = async (req, res, next) => {
    const { className, programme } = req.query;
    const { assessmentLink, lessonLink, subjectName } = req.body;
    const assessmentPresent = await Assessment.findOne({ $and: [{ className }, { programme }] });
    if (!assessmentPresent) {
        throw new BadUserRequestError(`Error: No lesson/assessment found for this class`);
    }
    const subjectPresent = assessmentPresent.lesson.find(asubject => asubject.subjectName == subjectName)
    if (!subjectPresent) {
        throw new BadUserRequestError(`Error: No assessment/lesson found for this subject`);
    }
    subjectPresent.assessmentLink = assessmentLink;
    subjectPresent.lessonLink = lessonLink;
    assessmentPresent.save();
    res.status(200).json({ status: "success", subjectPresent, message: "successfully updated" });
};

const deleteAssessment = async (req, res, next) => {
    const { className, programme } = req.query;
    const { subjectName } = req.body;
    const assessmentPresent = await Assessment.findOne({ $and: [{ className }, { programme }] });
    if (!assessmentPresent) {
        throw new BadUserRequestError(`Error: No lesson/assessment found for this class`);
    }
    const subjectPresent = assessmentPresent.lesson.find(asubject => asubject.subjectName == subjectName)
    if (!subjectPresent) {
        throw new BadUserRequestError(`Error: No assessment/lesson found for this subject`);
    }
    const deleteSuccess = assessmentPresent.lesson.splice(assessmentPresent.lesson.indexOf(subjectPresent),1)
    assessmentPresent.save()
    res.status(200).json({ status: "success", deleteSuccess, message: "successfully deleted" });
};

const setQuiz = async (req, res, next) => {
    const quizPresent = await Quiz.findOne({});
    if (quizPresent) {
        throw new BadUserRequestError("Error: A quiz has already been set");
    }
    const newQuiz = await Quiz.create(req.body)
    res.status(200).json({ status: "success", newQuiz, message: "Students now have access to this quiz for 30 minutes" });
};

const getQuiz = async (req, res, next) => {
    const quizPresent = await Quiz.findOne({});
    if (!quizPresent) {
        throw new NotFoundError("Error: No quiz has been set");
    }
    let date = quizPresent.updatedAt.toString()
    console.log(date)
    let dateonly = date.split(' ')
    let setTime = dateonly[4].split(":")
    setTime = setTime[0] + ":" + setTime[1]
    const convertTime24_12=t=>{
        let [h,...rest]=t.split(":");
        return (h=="12"?"12":h%12)+":"+rest.join(":")+(h<12?" AM":" PM");
    }
    setTime = convertTime24_12(setTime)
    res.status(200).json({ status: "success", quizPresent, message: `This quiz was set at ${setTime} and will close exactly 30 minutes after.` });
};

const editQuiz = async (req, res, next) => {
    const {quizlink} = req.body;
    const quizPresent = await Quiz.findOneAndUpdate({}, {quizlink},{new:true});
    if (!quizPresent) {
        throw new NotFoundError("Error: No quiz has been set");
    }

    res.status(200).json({ status: "success", quizPresent, message: "The link to the quiz has been updated. Students have just 30 minutes to access it" });
};

const getAssessment = async (req, res, next) => {
    const { className, programme } = req.query;
    const assessmentPresent = await Assessment.findOne({ $and: [{ className }, { programme }] });
    if (!assessmentPresent) {
        throw new NotFoundError("Error: No assessment set for your class");
    }
    const lessons = assessmentPresent.lesson
    res.status(200).json({ status: "success", lessons, message: "Click OK to view links to available lessons/assessment for your class" });
};

module.exports = { getAssessment, setAssessment, editAssessment, deleteAssessment, setQuiz, getQuiz, editQuiz }