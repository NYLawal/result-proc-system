const { AccessDeniedError } = require("./errors")

function superAdmin(req,res,next){
    const role = req.user.role
    if (role !== "superadmin") throw new AccessDeniedError("Error: You are not authorised to perform this action!")
    next()
}

function admin(req,res,next){
    const administrator = req.user.isAdmin
    if (!administrator) throw new AccessDeniedError("Error: You are not authorised to perform this action!")
    next()
}

function teacher(req,res,next){
    const role = req.user.role
    if (role !== "teacher") throw new AccessDeniedError("Error: You are not authorised to perform this action!")
    next()
}

function student(req,res,next){
    const role = req.user.role
    if (role !== "student") throw new AccessDeniedError("Error: You do not have access to this resource")
    next()
}


module.exports = {admin, superAdmin, teacher, student}

// function authRole(role) {
//     return (req, res, next) => {
//       if (req.user.role !== role) {
//         res.status(401);
//         return res.send("not allowed");
//       }
//       next();
//     };