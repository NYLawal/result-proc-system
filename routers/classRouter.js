const express = require('express');
const router = express.Router();
const {getClassSubjects, addClassSubject, removeClassSubject} 
       = require('../controllers/classController')
const authenticateUser = require('../middleware/auth')
const {admin, teacher, adminORteacher} = require('../middleware/roles')


router.route('/getSubjects').get([authenticateUser, teacher], getClassSubjects)
router.route('/addSubject').post([authenticateUser, admin], addClassSubject)
router.route('/removeSubject').post([authenticateUser, admin], removeClassSubject)


module.exports = router;