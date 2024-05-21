const express = require('express');
const router = express.Router();
const {addStaff,getStaff,getTeachers,editStaffQuery,updateStaff,deleteStaff} 
       = require('../controllers/staffController')
const authenticateUser = require('../middleware/auth')
const {superAdmin, admin} = require('../middleware/roles')       


router.post('/addStaff', [authenticateUser, superAdmin], addStaff)
router.get('/viewStaff', [authenticateUser, admin], getStaff)
router.get('/viewTeachers', [authenticateUser, admin], getTeachers)
router.post('/editStaff', [authenticateUser, superAdmin], editStaffQuery)
router.patch('/updateStaff', [authenticateUser, superAdmin], updateStaff)
router.delete('/deleteStaff', [authenticateUser, superAdmin], deleteStaff)



module.exports = router;