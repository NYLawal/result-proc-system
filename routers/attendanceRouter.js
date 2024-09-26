const express = require('express');
const router = express.Router();
const {getAttendance, markAttendance, editAttendanceDate, editAttendanceStatus, deleteDayAttendance, deleteTermAttendance} 
       = require('../controllers/attendanceController')
const authenticateUser = require('../middleware/auth')
const {superAdmin, admin, adminORteacher} = require('../middleware/roles')


router.route('/viewAttendance').get([authenticateUser], getAttendance)
router.route('/markAttendance').post([authenticateUser, adminORteacher], markAttendance)
router.route('/changeAttendanceDate').patch([authenticateUser, adminORteacher], editAttendanceDate)
router.route('/changeAttendanceStatus').patch([authenticateUser, adminORteacher], editAttendanceStatus)
router.route('/deleteDayAttendance').delete([authenticateUser, adminORteacher], deleteDayAttendance)
router.route('/deleteTermAttendance').delete([authenticateUser, admin], deleteTermAttendance)


module.exports = router;