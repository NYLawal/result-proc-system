const express = require('express');
const router = express.Router();
const {addScores, addTermComment, getScores, getClassScores, updateScores, markAttendance} 
       = require('../controllers/scoresController')
const authenticateUser = require('../middleware/auth')
const {admin, teacher, adminORteacher, adminORteacherORparent} = require('../middleware/roles')


router.route('/addScores').post([authenticateUser, adminORteacher], addScores)
router.route('/viewScores').get([authenticateUser, adminORteacherORparent], getScores)
router.route('/viewClassScores').get([authenticateUser, adminORteacher], getClassScores)
router.route('/updateScores').patch([authenticateUser, adminORteacher], updateScores)
router.route('/addComment').patch([authenticateUser, adminORteacher], addTermComment)
router.route('/markAttendance').patch([authenticateUser, adminORteacher], markAttendance)
// .get(getScores)

module.exports = router;