const express = require('express');
const router = express.Router();
const { getClassSubjects,
       addClassSubject,
       removeClassSubject,
       uploadImg, addDetails,
       addPrincipalSignature,
       addProprietorSignature,
       uploadPrplSignature, uploadPropSignature,
       addClass,
       removeClass
}
       = require('../controllers/classController')
const authenticateUser = require('../middleware/auth')
const { superAdmin, admin, adminORteacher } = require('../middleware/roles')


router.route('/getSubjects').get([authenticateUser, adminORteacher], getClassSubjects)
router.route('/addSubject').post([authenticateUser, admin], addClassSubject)
router.route('/removeSubject').post([authenticateUser, admin], removeClassSubject)
router.route('/addClass').post([authenticateUser, superAdmin], addClass)
router.route("/addDetails").post([authenticateUser, adminORteacher, uploadImg], addDetails);
router.route("/principalSignature").post([authenticateUser, admin, uploadPrplSignature], addPrincipalSignature);
router.route("/proprietorSignature").post([authenticateUser, superAdmin, uploadPropSignature], addProprietorSignature);
router.route('/removeClass').delete([authenticateUser, superAdmin], removeClass)


module.exports = router;