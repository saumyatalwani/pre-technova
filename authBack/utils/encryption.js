const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const Salt = Number(process.env.ENCRYPT_KEY)
const jwtSecret = process.env.JWT_SECRET;

const encryptPassword = async (password) => {
    return await bcrypt.hash(password, Salt);
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

const generateToken = (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
}

const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
}

module.exports = { encryptPassword, comparePassword, generateToken, verifyToken };