const User = require("../models/userModel")
const asyncHandler = require('express-async-handler')

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

module.exports = {
    createUser
}