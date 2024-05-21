const express = require('express');
const router = express.Router();
const {addStaff,getStaff,getTeachers,editStaffQuery,updateStaff} 
       = require('../controllers/staffController')
const authenticateUser = require('../middleware/auth')
const {superAdmin, admin} = require('../middleware/roles')       


router.post('/addStaff', [authenticateUser, superAdmin], addStaff)
router.get('/viewStaff', [authenticateUser, admin], getStaff)
router.get('/viewTeachers', [authenticateUser, admin], getTeachers)
router.post('/editStaff', [authenticateUser, superAdmin], editStaffQuery)
router.post('/updateStaff', [authenticateUser, superAdmin], updateStaff)



module.exports = router;