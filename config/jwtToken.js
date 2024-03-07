const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWTSECRET, {expiresIn: '3d'})
}

module.exports = {
    generateToken
}