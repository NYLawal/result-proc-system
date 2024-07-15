const express = require('express');
const router = express.Router();
const {addScores, addTermComment, getScores, getTermlyScores, getClassScores, updateScores, markAttendance, getScoresBySession} 
       = require('../controllers/scoresController')
const authenticateUser = require('../middleware/auth')
const {admin, teacher, adminORteacher, adminORteacherORparent} = require('../middleware/roles')


router.route('/addScores').post([authenticateUser, adminORteacher], addScores)
router.route('/viewScores').get([authenticateUser], getScores)
router.route('/viewTermlyScores').get([authenticateUser, adminORteacherORparent], getTermlyScores)
router.route('/viewScoresbySession').get([authenticateUser, adminORteacherORparent], getScoresBySession)
router.route('/viewClassScores').get([authenticateUser, adminORteacher], getClassScores)
router.route('/updateScores').patch([authenticateUser, adminORteacher], updateScores)
router.route('/addComment').patch([authenticateUser, admin], addTermComment)
router.route('/markAttendance').patch([authenticateUser, adminORteacher], markAttendance)
// .get(getScores)

module.exports = router;