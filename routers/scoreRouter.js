const express = require('express');
const router = express.Router();
const {addScores, addTermComment, getScores, getTermlyScores, getClassScores, updateScores, getScoresBySession, deleteScores, addStudentsComments} 
       = require('../controllers/scoresController')
const authenticateUser = require('../middleware/auth')
const {admin, teacher, adminORteacher, adminORteacherORparent} = require('../middleware/roles')


router.route('/addScores').post([authenticateUser, adminORteacher], addScores)
router.route('/addComments').post([authenticateUser], addStudentsComments)
router.route('/viewScores').get([authenticateUser], getScores)
router.route('/viewTermlyScores').get([authenticateUser, adminORteacherORparent], getTermlyScores)
router.route('/viewScoresbySession').get([authenticateUser, adminORteacherORparent], getScoresBySession)
router.route('/viewClassScores').get([authenticateUser, adminORteacher], getClassScores)
router.route('/deleteScores').get([authenticateUser, admin], deleteScores)
router.route('/updateScores').patch([authenticateUser, adminORteacher], updateScores)
router.route('/addComment').patch([authenticateUser, admin], addTermComment)
// router.route('/getDupl').get([authenticateUser], getDuplicates)


module.exports = router;