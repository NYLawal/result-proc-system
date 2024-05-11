const jwt= require('jsonwebtoken')
const User = require('../models/userModel');
const { UnAuthorizedError, BadUserRequestError } = require('./errors');


 function authenticateUser(req, res, next){
  // const token = req.header('x-auth-token');
  // if(!token) throw new BadUserRequestError("Error: no token present");
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer')) throw new BadUserRequestError("Error: no token present, , you need to sign in");
  const token = authHeader.split(' ')[1]
  try{
    const payload =  jwt.verify(token, process.env.jwt_secret_key)
    req.user = payload
    next()
  }
  catch (err){
    throw new UnAuthorizedError("Error: unauthorised access");
  }
} 
module.exports = authenticateUser