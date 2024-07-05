const express = require('express');
const router = express.Router();
const {setAssessment, getAssessment, editAssessment, deleteAssessment, getQuiz, setQuiz, editQuiz } 
       = require('../controllers/assessmentController')
const authenticateUser = require('../middleware/auth')
const {admin, teacher, adminORteacher, parentORstudent} = require('../middleware/roles')

router.route('/setAssessment').post([authenticateUser, adminORteacher], setAssessment)
router.route('/editAssessment').patch([authenticateUser, adminORteacher], editAssessment)
router.route('/removeAssessment').patch([authenticateUser, adminORteacher], deleteAssessment)
router.route('/getLink').get(authenticateUser, getAssessment)
router.route('/setQuiz').post([authenticateUser, admin], setQuiz)
router.route('/editQuiz').patch([authenticateUser, admin], editQuiz)
router.route('/getQuiz').get([authenticateUser, parentORstudent], getQuiz)


module.exports = router;