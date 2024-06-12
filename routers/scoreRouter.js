const express = require('express');
const router = express.Router();
const {addScores, addTermComment, getScores, getClassScores, updateScores} 
       = require('../controllers/scoresController')
const authenticateUser = require('../middleware/auth')
const {admin, teacher, adminORteacher} = require('../middleware/roles')


router.route('/addScores').post([authenticateUser, adminORteacher], addScores)
router.route('/viewScores').get([authenticateUser, adminORteacher], getScores)
router.route('/viewClassScores').get([authenticateUser, adminORteacher], getClassScores)
router.route('/updateScores').patch([authenticateUser, adminORteacher], updateScores)
router.route('/addComment').patch([authenticateUser, adminORteacher], addTermComment)
// .get(getScores)

module.exports = router;