const express = require('express');
const router = express.Router();
const {addScores, addTermComment, getScores} 
       = require('../controllers/scoresController')
const authenticateUser = require('../middleware/auth')
const {admin, teacher, adminORteacher} = require('../middleware/roles')


router.route('/addComment').patch([authenticateUser, adminORteacher], addTermComment)
router.route('/addScores').post([authenticateUser, adminORteacher], addScores)
router.route('/viewScores').get([authenticateUser, adminORteacher], getScores)
// .get(getScores)

module.exports = router;