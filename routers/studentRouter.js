const express = require('express');
const router = express.Router();
const {addStudent,getAllStudents,getStudent,deleteStudent,updateStudent} = require('../controllers/studentController')

// router.get('/', getUser)
// router.get('/all', getAllUsers)
// router.post('/', addUser)
// router.put('/:name', editUser)
// router.delete('/all', deleteAllUsers)
// router.delete('/:name', deleteUser)

router.route('/').post(addStudent).get(getStudent)
router.route('/all').get(getAllStudents)
router.route('/').delete(deleteStudent)
router.route('/').patch(updateStudent)
// router.route('/all').get(getAllUsers).delete(deleteAllUsers)
// router.route('/:name').put(editUser).delete(deleteUser)

module.exports = router;