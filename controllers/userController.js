const  { MailNotSentError, BadUserRequestError, NotFoundError, UnAuthorizedError } = 
require('../middleware/errors')
require('dotenv').config();
const _ = require('lodash')
const bcrypt = require('bcrypt')
// const cryptoRandomString = require('crypto-random-string') 
const crypto = require('crypto');
const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const Student = require("../models/studentModel");
const Token = require('../models/tokenModel')
// const sendEmail = require ("../utils/mailHandler")
const {
    userSignUpValidator,
    userLogInValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} = require("../validators/userValidator");
const SENDMAIL = require('../utils/mailHandler');


const userSignUp = async (req, res, next) => {
    const { error } = userSignUpValidator(req.body);
    if (error) throw error

    const user = await User.findOne({ email: req.body.email });
    if (user) throw new BadUserRequestError("Error: an account with this email already exists");

    const isStudent = await Student.findOne({ email: req.body.email });
    if (isStudent){
         req.body.userRole = "student";
    }

    const isParent = await Student.findOne({ parentEmail: req.body.email });
    if (isParent){
         req.body.userRole = "parent";
    }

    const isStaff = await Staff.findOne({ email: req.body.email });
    if (isStaff){
         req.body.userRole = isStaff.role;
         req.body.isAdmin = isStaff.isAdmin;
         if (isParent)  req.body.otherRole = "parent";
    }
    
    const newUser = await User.create(req.body);
    const token = newUser.generateToken()
    res.header('token', token).status(201).json({
        status: "Success",
        message: "User created successfully",
        user:  _.pick(newUser, ['email', 'isAdmin', 'userRole' ])
    });    
}


const userLogIn = async (req, res, next) => {
    const { error } = userLogInValidator(req.body);
    if (error) throw error
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new UnAuthorizedError("Error: invalid email or password");

    const isValidPassword = await user.comparePassword(req.body.password)
    if (!isValidPassword) throw new UnAuthorizedError("Error: invalid email or password");
    
    const access_token = user.generateToken()
    res.header('access_token', access_token).status(200).json({
        status: "Success",
        message: "Successfully logged in",
        // user:  _.pick(user, ['_id','email']),
        user,
        access_token: access_token
    });
}


const forgotPassword = async (req, res) => {
        const { error } = forgotPasswordValidator(req.body);
        if (error) throw error

        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new BadUserRequestError("Error: invalid email!");
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
               
            // token = await Token.create({ userId: user._id, token: crypto.randomBytes(32).toString("hex")})
            // console.log(token)
            // token = await Token.create({ userId: user._id, token: cryptoRandomString({length: 10})})
        }

        // const link = `${process.env.RESET_PASSWORD_PAGE}/user/password-reset/${user._id}/${token.token}`;
        const link = `${process.env.RESET_PASSWORD_PAGE}?userId=${user._id}&token=${token.token}`;
        await SENDMAIL(user.email, "Password Reset", link);

        res.status(200).send("Password reset link has been sent to your email account");
}

const resetPassword = async(req, res) => {
      const { error } = resetPasswordValidator(req.body);
        if (error) throw error
  
        const user = await User.findById(req.params.userId);
        console.log(req.query.userId);
        if (!user) return res.status(400).send("Invalid link");
  
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");
  
        user.password = req.body.password;
        await user.save();
        await token.deleteOne();
  
        res.status(200).send("Password reset is successful");
  }

  const portalRedirect = async(req,res) =>{
    let role = req.user.role;
    let other_role = req.user.other_role;
    res.status(200).json({
    status: "Success",
    message: `Successfully authenticated as ${role}`,
    role,
    other_role
    })
    }

  




module.exports = {userSignUp, userLogIn,forgotPassword, resetPassword, portalRedirect}