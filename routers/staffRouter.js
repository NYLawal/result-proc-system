const express = require('express');
const router = express.Router();
const { addStaff, getStaff, getTeachers, editStaffQuery, updateStaff, deleteStaff, getTeacherClass, getClassesAssigned, assignAsTeacher, setDetails, deassignTeacher, switchClasses }
       = require('../controllers/staffController')
const authenticateUser = require('../middleware/auth')
const { superAdmin, admin } = require('../middleware/roles')


router.post('/addStaff', [authenticateUser, superAdmin], addStaff)
router.get('/viewStaff/:page', [authenticateUser, admin], getStaff)
router.get('/viewTeachers/:page', [authenticateUser, admin], getTeachers)
router.get('/getClass', [authenticateUser], getTeacherClass)
router.get('/getClassesAssigned', [authenticateUser, admin], getClassesAssigned)
router.post('/editStaff', [authenticateUser, superAdmin], editStaffQuery)
router.post('/setDetails', [authenticateUser, admin], setDetails)
router.post('/switchClass', [authenticateUser], switchClasses)
router.patch('/assignTeacher', [authenticateUser, superAdmin], assignAsTeacher)
router.patch('/deassignTeacher', [authenticateUser, superAdmin], deassignTeacher)
router.patch('/updateStaff', [authenticateUser, superAdmin], updateStaff)
router.delete('/deleteStaff', [authenticateUser, superAdmin], deleteStaff)



module.exports = router;