const express = require('express');
const router = express.Router();
const {addScores,getScores} 
       = require('../controllers/scoresController')


router.route('/').post(addScores).get(getScores)

module.exports = router;