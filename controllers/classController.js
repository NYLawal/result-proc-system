
const sClass = require("../models/classModel");
const CardDetails = require("../models/carddetailsModel");
const Staff = require("../models/staffModel");
const { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } =
  require('../middleware/errors')

const { addStudent } = require("./studentController");
const { model } = require("mongoose");

const multer = require("multer"); // multer will be used to handle the form data.
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
// const _ = require("lodash");
const {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} = require("aws-sdk");
// user-defined modules

// const s3Client = new S3Client({
//   region: process.env.S3_BUCKET_REGION,
//   credentials: {
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   },
// });

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const upload = (str1, str2) =>
  multer({
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET_NAME,
      // acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        // const fileName = "img" + Date.now() + "_" + file.originalname;
        const fileNameOriginal = file.originalname.split(".");
        let fileExtension = fileNameOriginal.pop()
        let fileName = "img_" + str1 + "_" + str2 + "." + fileExtension;
        cb(null, fileName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else return cb(new BadUserRequestError("Invalid file type"));
    },
  });

const uploadImg = async (req, res, next) => {
  const classteacher = await Staff.findOne({email:req.user.email})
  const teacher_class = classteacher.teacherClass
  const teacher_programme = classteacher.teacherProgramme
  const uploadSingle = upload(teacher_class,teacher_programme).single("signatureImage");
  uploadSingle(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(404).end("file exceeds accepted standard!");
    } else if (err) {
      return res.status(404).end(err.message);
    } else if (!req.file) {
      return res.status(404).end("File is required!");
    }
    // if image uploads successfully, get url of image and pass to the next middleware
    req.signature_url = req.file.location;
    next();
  });
};

const uploadPrplSignature = async (req, res, next) => {
  const principal = await Staff.findOne({email:req.user.email})
  const prcpl_programme = principal.teacherProgramme
  const uploadSingle = upload(prcpl_programme, "principal").single("signatureImage"); 
  uploadSingle(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(404).end("file exceeds accepted standard!");
    } else if (err) {
      return res.status(404).end(err.message);
    } else if (!req.file) {
      return res.status(404).end("File is required!");
    }
    // if image uploads successfully, get url of image and pass to the next middleware
    req.signature_url = req.file.location;
    next();
  });
};

const uploadPropSignature = async (req, res, next) => {
  const uploadSingle = upload("madrasah", "proprietor").single("signatureImage"); 
  uploadSingle(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(404).end("file exceeds accepted standard!");
    } else if (err) {
      return res.status(404).end(err.message);
    } else if (!req.file) {
      return res.status(404).end("File is required!");
    }
    // if image uploads successfully, get url of image and pass to the next middleware
    req.signature_url = req.file.location;
    next();
  });
};

// add details for a class
const addDetails = async (req, res, next) => {
  const { noInClass } = req.body;
  const {className, programme} = req.query;
  const classExists = await sClass.findOne({
    $and:
    [
      {className},
      {programme}
    ]
  })
  if (!classExists) throw new NotFoundError("Error: the requested class does not exist");
    classExists.noInClass = noInClass 
    classExists.teacherSignature = req.signature_url, //coming from the uploadImg middleware
    classExists.save()

  res.status(200).json({
    status: "Success",
    message: "details added successfully",
    classExists
  });
};

const addPrincipalSignature = async (req, res, next) => {
  const {programme} = req.query
  const detailsExist = await CardDetails.findOne({programme})  
    if (!detailsExist){
      const addDetails = await CardDetails.create({programme, principalSignature:req.signature_url})
      return res.status(201).json({
        status: "Success",
        message: "principal signature added successfully",
        addDetails
      });
      }
      detailsExist.principalSignature = req.signature_url;
      detailsExist.save();
      
      res.status(200).json({
        status: "Success",
        message: "principal signature updated successfully",
        detailsExist
  });
};

const addProprietorSignature = async (req, res, next) => {
  const {programme} = req.query
  const detailsExist = await CardDetails.find({}) 
  for (let i=0; i < detailsExist.length; i++) {
    detailsExist[i].proprietorSignature = req.signature_url;
    detailsExist[i].save();
  }
      
      res.status(200).json({
        status: "Success",
        message: "proprietor signature added successfully",
        detailsExist
  });
};

const getClassSubjects = async (req, res, next) => {
  const {className, programme} = req.query;
  const classExists = await sClass.findOne({
  $and:
  [
    {className},
    {programme}
  ]
})
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



module.exports = {getClassSubjects, addClassSubject, removeClassSubject, uploadImg, uploadPrplSignature, uploadPropSignature, addDetails, addPrincipalSignature, addProprietorSignature}
