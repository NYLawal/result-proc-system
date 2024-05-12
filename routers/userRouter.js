const express = require('express');
const router = express.Router();
const {userSignUp,userLogIn,forgotPassword,resetPassword,addStaff} 
       = require('../controllers/userController')
const authenticateUser = require('../middleware/auth')
const {superAdmin, admin} = require('../middleware/roles')       


router.route('/signup').post(userSignUp)
router.route('/login').post(userLogIn)
router.post('/forgotPassword', forgotPassword)
router.post('/password-reset/:userId/:token', resetPassword)
router.post('/addStaff', [authenticateUser, superAdmin], addStaff)



module.exports = router;