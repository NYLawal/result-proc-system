const express = require('express');
const router = express.Router();
const { addStaff, getStaff, getTeachers, editStaffQuery, updateStaff, deleteStaff, getTeacherClass, getClassesAssigned, assignAsTeacher, setDetails, deassignTeacher, switchClasses }
       = require('../controllers/staffController')
const authenticateUser = require('../middleware/auth')
const { superAdmin, admin, adminORteacher } = require('../middleware/roles')


router.get('/viewStaff/:page', [authenticateUser, admin], getStaff)
router.get('/viewTeachers/:page', [authenticateUser, admin], getTeachers)
router.get('/getClass', [authenticateUser], getTeacherClass)
router.get('/getClassesAssigned', [authenticateUser, adminORteacher], getClassesAssigned)
router.post('/addStaff', [authenticateUser, admin], addStaff)
router.post('/editStaff', [authenticateUser, admin], editStaffQuery)
router.post('/setDetails', [authenticateUser, admin], setDetails)
router.post('/switchClass', [authenticateUser, adminORteacher], switchClasses)
router.patch('/assignTeacher', [authenticateUser, admin], assignAsTeacher)
router.patch('/deassignTeacher', [authenticateUser, admin], deassignTeacher)
router.patch('/updateStaff', [authenticateUser, admin], updateStaff)
router.delete('/deleteStaff', [authenticateUser, superAdmin], deleteStaff)



module.exports = router;