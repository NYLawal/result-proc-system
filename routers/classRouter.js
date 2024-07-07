const express = require('express');
const router = express.Router();
const {getClassSubjects, addClassSubject, removeClassSubject, uploadImg, addDetails} 
       = require('../controllers/classController')
const authenticateUser = require('../middleware/auth')
const {admin, teacher, adminORteacher} = require('../middleware/roles')


router.route('/getSubjects').get([authenticateUser, adminORteacher], getClassSubjects)
router.route('/addSubject').post([authenticateUser, admin], addClassSubject)
router.route('/removeSubject').post([authenticateUser, admin], removeClassSubject)
router.route("/addDetails").post([authenticateUser, adminORteacher, uploadImg], addDetails);


module.exports = router;