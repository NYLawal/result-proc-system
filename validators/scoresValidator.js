const Joi = require("joi");
const { ValidationError } = require("../middleware/errors");

function addScoresValidation(scores) {
    const schema = Joi.object({
        sessionName: Joi.string()
            .required()
            .error(
                new ValidationError("session cannot be empty and must be in the format xxxx/yyyy")
            ),
        className: Joi.string()
            .required()
            .error(new ValidationError("please input a valid class name")),
        term: Joi.object({
            termName: Joi.string().required().error(new ValidationError("term cannot be empty")),
            subjects: Joi.object({
                subjectName: Joi.string()
                    .required()
                    .error(
                        new ValidationError(
                            "input a subject name"
                        )
                    ),
                testScore: Joi.number()
                    // .required()
                    .min(0)
                    .max(40)
                    .error(
                        new ValidationError(
                            "test score cannot be empty and must be a number between 0 and 40"
                        )
                    ),
                examScore: Joi.number()
                    // .required()
                    .min(0)
                    .max(60)
                    .error(
                        new ValidationError(
                            "exam score cannot be empty and must be a number between 0 and 60"
                        )
                    ),
                totalScore: Joi.number()
                    .min(0)
                    .max(100)
                    .error(
                        new ValidationError(
                            "total score cannot be empty and must be a number between 0 and 100"
                        )
                    ),
                remark: Joi.string()
                    .required()
                    .error(
                        new ValidationError(
                            "input a remark"
                        )
                    ),
            }),
            comment: Joi.string().error(new ValidationError("input a comment")),
        })
    }).strict();

    return schema.validate(scores);
}


function addCommentValidation(comment) {
    const schema = Joi.object({
        comment: Joi.string()
            .required()
            .error(
                new ValidationError("Please input the comment")
            ),
        sessionName: Joi.string()
            .required()
            .error(
                new ValidationError("session must be specified")
            ),
        className: Joi.string()
            .required()
            .error(
                new ValidationError("Please input the student's class")
            ),
        termName: Joi.string()
            .required()
            .error(
                new ValidationError("Please specify the term")
            ),
    }).strict();

    // dbDebugger(schema.subjects)

    return schema.validate(comment);
}

module.exports = {
    addScoresValidation,
    addCommentValidation
};

// Joi.string().required().valid("fiqh", "hadith", "tawheed", "tafseer", "tadribaatuLugha", "lugha", "imlah", "hifz", "tajweed", "tahbeer",
//             "taajiyya", "qiraaha", "khatu", "adhkaar", "nahw", "sarf").error(new Error("subject name is inavlid")),
