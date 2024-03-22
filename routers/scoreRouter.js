const express = require('express');
const router = express.Router();
const {addScores} 
       = require('../controllers/scoresController')


router.route('/').post(addScores)

module.exports = router;