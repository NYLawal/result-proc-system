const Student = require('../models/studentModel')
const scores = require('../models/scoreModel')
const classes = require('../models/classModel')
const asyncWrapper = require('../middleware/async')


const addStudent = asyncWrapper(async(req,res) =>{
    const student = await Student.create(req.body)
    res.status(201).json({student, msg:"student added successfully"});
    })


const getAllStudents = asyncWrapper(async (req,res) => {
        const students =  await Student.find({}) 
            res.status(200).json({success:"true", students});
    })

const getStudent = asyncWrapper(async (req,res,next) => {
        const {firstName, lastName} = req.query;
        const student = await Student.findOne({firstName,lastName})
        if(!student){
            // return res.status(404).json({msg:`student with name: ${firstName} ${lastName} does not exist`})
            return next(new Error('Error: no such student found')); 
        }
        res.status(200).json({student, msg:"student found!"})    
})

const deleteStudent = asyncWrapper(async (req,res,next) =>{
        let {firstName, lastName} = req.query;   
        const student = await Student.findOneAndDelete({firstName,lastName});
        if(!student){
            // return res.status(404).json({status:"failed", msg:"no such student found!"});
            return next(new Error('Error: no such student found')); 
        }
        res.status(200).json({status:"success", msg:"user deleted successfully"});
})


const updateStudent = asyncWrapper(async(req,res,next) =>{
    let {firstName} = req.query;
    const student = await Student.findOneAndUpdate({firstName}, req.body,
         {new:true,
          runValidators:true
         });
    if(!student){
        // return res.status(404).json({status:"failed", msg:"no such student found!"});
        return next(new Error('Error: no such student found')); 
    }
    res.status(200).json({status:"success", msg:"user updated successfully", student});
})

// const deleteAllUsers = (req,res)=> {
//     users.length = 0;
//     console.log(users);
//     res.status(200).json({success:"true", data:users})
// }


module.exports = {addStudent, getAllStudents, getStudent, deleteStudent, updateStudent}

// *******************************************************************************************************************
// const getStudent = async (req,res) => {
//     try {
//         const {firstName, lastName} = req.query;
//         const student = await Student.findOne({firstName,lastName})
//         if(!student){
//             return res.status(404).json({msg:`student with name: ${firstName} ${lastName} does not exist`})
//         }
//         res.status(200).json({student, msg:"student found!"})
//     } catch (error) {
//         res.status(500).json({msg:error})
//     }
// }
