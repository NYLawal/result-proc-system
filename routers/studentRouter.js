const express = require('express');
const router = express.Router();
const {addStudent,
       getStudents,
       getOneStudent,
       getAllStudents,
       deleteStudent,
       updateStudent,
       } 
       = require('../controllers/studentController')
const authenticateUser = require('../middleware/auth')
const {admin} = require('../middleware/roles')


router.route('/registerStudent').post([authenticateUser, admin], addStudent).get(getOneStudent)
router.route('/:page').get(getStudents)
router.route('/all/:page').get(getAllStudents)
router.route('/').delete(deleteStudent)
router.route('/').patch(updateStudent)


module.exports = router;