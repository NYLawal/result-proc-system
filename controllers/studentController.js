const Student = require('../models/studentModel')
const validateNewStudent = require('../validators/studentValidator')
const scores = require('../models/scoreModel')
const classes = require('../models/classModel')
// const asyncWrapper = require('../middleware/async')


const addStudent = async(req,res,next) =>{
    const { error } = validateNewStudent(req.body)
    if(error) throw error
    const student = await Student.create(req.body)
    res.status(201).json({student, msg:"student added successfully"});
    }

const getStudents = async (req,res) => {
    const pageNumber = req.params.page
    const pageSize = 5;
    const students =  await Student
        .find({})
        .sort({firstName: 1})
        .select("admNo firstName lastName status registeredOn")
        .skip((pageNumber-1)*pageSize)
        .limit(pageSize) 
        res.status(200).json({success:"true", students, noOfStudents:students.length});
    }

const getOneStudent = async (req,res,next) => {
        const {admNo} = req.query;
        const student = await Student.findOne({admNo})
        if(!student){
            return next(new Error('Error: no such student found')); 
        }
        res.status(200).json({student, msg:"student found!"})    
}

const updateStudent = async(req,res,next) =>{
    let {admNo} = req.query;
    const student = await Student.findOneAndUpdate({admNo}, req.body,{new:true, runValidators:true });
        if(!student){
            // return res.status(404).json({status:"failed", msg:"no such student found!"});
            return next(new Error('Error: no such student found')); 
        }
        res.status(200).json({status:"success", msg:"user updated successfully", student});
    }
    
    const deleteStudent = async (req,res,next) =>{
            let {admNo} = req.query;   
            const student = await Student.findOneAndDelete({admNo});
            if(!student){
                // return res.status(404).json({status:"failed", msg:"no such student found!"});
                return next(new Error('Error: no such student found')); 
            }
            res.status(200).json({status:"success", msg:"user deleted successfully"});
    }


module.exports = {addStudent, getStudents, getOneStudent, deleteStudent, updateStudent}

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
