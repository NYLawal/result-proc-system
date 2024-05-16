const express = require('express');
const router = express.Router();
const {userSignUp,userLogIn,forgotPassword,resetPassword,addStaff,portalRedirect} 
       = require('../controllers/userController')
const authenticateUser = require('../middleware/auth')
const {superAdmin, admin} = require('../middleware/roles')       


router.route('/signup').post(userSignUp)
router.route('/login').post(userLogIn)
router.post('/forgotPassword', forgotPassword)
router.post('/password-reset/:userId/:token', resetPassword)
router.post('/addStaff', [authenticateUser, superAdmin], addStaff)
router.post('/registerStudent', [authenticateUser, admin], addStudent)
router.get('/authorise', authenticateUser, portalRedirect)



module.exports = router;