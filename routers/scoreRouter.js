const express = require('express');
const router = express.Router();
const {addScores, addTermComment} 
       = require('../controllers/scoresController')
const authenticateUser = require('../middleware/auth')
const {admin,teacher} = require('../middleware/roles')


router.route('/addComment').patch([authenticateUser, teacher], addTermComment)
router.route('/addScores').post([authenticateUser, teacher], addScores)
// .get(getScores)

module.exports = router;