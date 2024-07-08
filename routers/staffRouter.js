const express = require('express');
const router = express.Router();
const {addStaff,getStaff,getTeachers,editStaffQuery,updateStaff,deleteStaff, getTeacherClass, assignAsTeacher,setDetails} 
       = require('../controllers/staffController')
const authenticateUser = require('../middleware/auth')
const {superAdmin, admin} = require('../middleware/roles')       


router.post('/addStaff', [authenticateUser, superAdmin], addStaff)
router.get('/viewStaff/:page', [authenticateUser, admin], getStaff)
router.get('/viewTeachers/:page', [authenticateUser, admin], getTeachers)
router.get('/getClass', [authenticateUser], getTeacherClass)
router.post('/editStaff', [authenticateUser, superAdmin], editStaffQuery)
router.post('/setDetails', [authenticateUser, admin], setDetails)
router.patch('/assignTeacher', [authenticateUser, superAdmin], assignAsTeacher)
router.patch('/updateStaff', [authenticateUser, superAdmin], updateStaff)
router.delete('/deleteStaff', [authenticateUser, superAdmin], deleteStaff)



module.exports = router;