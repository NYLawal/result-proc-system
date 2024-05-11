const { AccessDeniedError } = require("./errors")

function superAdmin(req,res,next){
    const role = req.user.role
    if (role !== "superadmin") throw new AccessDeniedError("Error: Access Denied!")
    next()
}

function admin(req,res,next){
    if (!req.user.isAdmin) throw new AccessDeniedError("Error: Access Denied!")
    next()
}

function isStudent(req,res,next){
    const role = req.user.role
    if (role !== "student") throw new AccessDeniedError("Error: You do not have access to this resource")
    next()
}

module.exports = {admin, superAdmin, isStudent}

// function authRole(role) {
//     return (req, res, next) => {
//       if (req.user.role !== role) {
//         res.status(401);
//         return res.send("not allowed");
//       }
//       next();
//     };