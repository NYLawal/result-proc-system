const express = require('express');
const router = express.Router();
const {userSignUp,userLogIn,forgotPassword,resetPassword,addAdmin} 
       = require('../controllers/userController')
const authenticateUser = require('../middleware/auth')
const {superAdmin, admin} = require('../middleware/roles')       


router.route('/signup').post(userSignUp)
router.route('/login').post(userLogIn)
router.post('/forgotPassword', forgotPassword)
router.post('/password-reset/:userId/:token', resetPassword)
router.post('/admin', [authenticateUser, superAdmin], addAdmin)



module.exports = router;