const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config()
const jwtKey = process.env.JWT_SECRET_KEY

exports.signToken = (emailAddress, userID) => {
    const token = jwt.sign({emailAddress, userID}, jwtKey, { 
        expiresIn: '7d'
    })
    return token
}

exports.verifyToken = (token) => {
    return jwt.verify(token, jwtKey)
}
