const express = require('express');
const router = express.Router();
const {addScores, createStudentScores} 
       = require('../controllers/scoresController')
const authenticateUser = require('../middleware/auth')
const {admin} = require('../middleware/roles')


router.route('/createScores').post(createStudentScores)
router.route('/addScores').post([authenticateUser, teacher], addScores)
// .get(getScores)

module.exports = router;