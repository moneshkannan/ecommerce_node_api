const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async(req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
        try{
            const decode = jwt.verify(token, process.env.JWTSECRET)
            const user = await User.findById(decode?.id)
            req.user = user
            next()
            console.log(decode)
        }catch(e){
            throw new Error("Not Authorizer token expired, please login again");
        }
    }else{
        throw new Error('there is no token attached to header')
    }
})

const isAdmin = asyncHandler(async(req, res, next) => {
    const {email} = req.user
    const adminUser = await User.findOne({email})
    if (adminUser.role !== 'admin'){
        throw new Error('you are not authorized')
    }else{
        next();
    }
})

module.exports = {
    authMiddleware,
    isAdmin
}