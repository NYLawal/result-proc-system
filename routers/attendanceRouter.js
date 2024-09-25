const express = require('express');
const router = express.Router();
const {getAttendance, markAttendance, deleteAttendance} 
       = require('../controllers/attendanceController')
const authenticateUser = require('../middleware/auth')
const {superAdmin, admin, adminORteacher} = require('../middleware/roles')


router.route('/markAttendance').patch([authenticateUser, adminORteacher], markAttendance)
router.route('/viewAttendance').get([authenticateUser], getAttendance)
router.route('/deleteAttendance').delete([authenticateUser, admin], deleteAttendance)


module.exports = router;