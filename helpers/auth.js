const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config()
const jwtKey = process.env.JWT_SECRET_KEY

exports.signToken = (emailAddress) => {
    const token = jwt.sign({emailAddress}, jwtKey, { 
        expiresIn: '7d'
    })
    return token
}

exports.verifyToken = (token) => {
    return jwt.verify(token, jwtKey)
}
