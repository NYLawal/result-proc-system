const express = require('express');
const router = express.Router();
const { updateBills, getBill, updateLastPayment } = require('../controllers/billingController')
const authenticateUser = require('../middleware/auth')
const {admin, bursar} = require('../middleware/roles')       


router.post('/makebill', [authenticateUser, admin], updateBills)
router.post('/updatepayment', [authenticateUser, admin], updateLastPayment)
router.get('/viewbill', [authenticateUser, admin], getBill)


module.exports = router;