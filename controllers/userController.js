const { response } = require("express")
const { generateToken } = require("../config/jwtToken")
const User = require("../models/userModel")
const asyncHandler = require('express-async-handler')
const { validMongoDbId } = require("../utils/validateMongoDbId")
const { generateRefreshToken } = require("../config/refreshToken")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("./emailController")

const createUser = asyncHandler(async (req, res) => {
    const { email } = req.body

    const findUser = await User.findOne({email: email})
    if (!findUser) {
        const newUser = await User.create(req.body)
        return res.json(newUser)
    }else {
        throw new Error('User already exists')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const findUser =  await User.findOne({email})

    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateUser = await User.findByIdAndUpdate(findUser._id,
            {
                refreshToken: refreshToken
            },{
                new: true,
            })
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 72*60*60*1000
        })
        return res.json({...findUser['_doc'], token: generateToken(findUser?._id)})
    }else{
        throw new Error('Invalid Credentials')
    }
})


// get all users
const getAllUser = asyncHandler(async(req, res) => {
    try{
        const allUser = await User.find()
        return res.json(allUser)
    }catch(err){
        throw new Error(err)
    }
})

// get single users
const getUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validMongoDbId(id)
    try{
        const getUser = await User.findById(id);
        return res.json({getUser: getUser});
    }catch(err){
        throw new Error(err)
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const {_id} = req.user
    validMongoDbId(_id)
    try{
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                ...req.body
            },{new: true})
        return res.json(updateUser)
    }catch(err){
        throw new Error(err)
    }
})

// get delete users
const deleteUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validMongoDbId(id)
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        return res.json({deleteUser: deleteUser});
    }catch(err){
        throw new Error(err)
    }
})

const blockUser = asyncHandler(async (req, res) =>{
    const {id} = req.params
    validMongoDbId(id)
    try{
        const user = await User.findByIdAndUpdate(id,{isBlocked: true},{new: true})
        return res.json({message: "user is Blocked"})
    }catch(err){
        throw new Error(err)
    }
})
const unBlockUser = asyncHandler(async (req, res) =>{
    const {id} = req.params
    validMongoDbId(id)
    try{
        const user = await User.findByIdAndUpdate(id,{isBlocked: false},{new: true})
        return res.json({message: "user is unBlocked"})
    }catch(err){
        throw new Error(err)
    }
})

// handle refresh token
const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error('no Refresh token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if(!user) throw new Error('No Refresh Token is available in db or Mismatched')
    jwt.verify(refreshToken, process.env.JWTSECRET, ((err, decode) => {
        if(err || user.id !== decode.id){
            throw new Error("there is something error with the refresh token")
        }
        const accessToken = generateToken(user?.id)
        res.json({accessToken})
    }))
})

// logout
const logout = asyncHandler(async(req, res)=>{
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error('no Refresh token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if(!user){
        res.clearCookie('refreshToken',{
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204) // forbidden
    }
    await User.findOneAndUpdate({refreshToken: refreshToken},{
        refreshToken: ""
    })
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204) // forbidden
})

// update Password
const updatePassword = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {password} = req.body
    validMongoDbId(_id)
    const user = await User.findById(_id)
    if(password){
        user.password = password
        const updatedPassword = await user.save()
        return res.json(updatedPassword)
    }else{
        return res.json(user)
    }
})

const forgotPasswordToken = asyncHandler(async(req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user) throw new Error('User not found with this email');
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `hi, please follow this link to reset your password, this link will be valid for 10 minutes from now <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`
        const data = {
            to: email,
            text: `Hey ${user.firstname}`,
            subject: `Password reset Link`,
            html: resetURL
        }
        sendEmail(data)
        return res.json(token)
    }catch(err){
        throw new Error(err)
    }
})

module.exports = {
    createUser,
    loginUser,
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unBlockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken
}