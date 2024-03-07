const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWTSECRET, {expiresIn: '1d'})
}

module.exports = {
    generateToken
}