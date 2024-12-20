const { encryptPassword, comparePassword, generateToken, verifyToken } = require('../../utils/encryption');
const User = require('../../models/userModel');
const { sendMail } = require('../../utils/mailService');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { email, password, userDetail, name, age, sex, experience, vehicle } = req.body;

        const hashedPassword = await encryptPassword(password);

        const verificationToken = generateToken({ email });

        const newUser = new User({
            email,
            password: hashedPassword,
            userDetail,
            name,
            age,
            sex,
            experience,
            vehicle,
            verified: false,
            verificationToken
        });
        await newUser.save();

        const verificationLink =  process.env.VERIFICATION_LINK + verificationToken;

        sendMail(email, 'Verify your email', 'verification', { verificationLink });

        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const isPasswordCorrect = await comparePassword(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        if (!existingUser.verified) {
            return res.status(400).json({
                message: 'Email not verified'
            });
        }
        // userid as payload
        const token = generateToken({ id: existingUser._id });
        res.status(200).json({
            message: 'Login successful',
            token
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const isPasswordCorrect = await comparePassword(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        if (!existingUser.verified) {
            return res.status(400).json({
                message: 'Email not verified'
            });
        }
        if (existingUser.role !== 'admin') {
            return res.status(400).json({
                message: 'Not authorized as admin'
            });
        }
        // userid as payload
        const token = generateToken({ id: existingUser._id });
        res.status(200).json({
            message: 'Login successful',
            token
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    res.status(200).json({
        message: 'Logout successful'
    });
};

const verify = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = verifyToken(token);
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        user.verified = true;
        await user.save();
        res.status(200).json({
            message: 'Email verified successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        if (user.verified) {
            return res.status(400).json({
                message: 'Email already verified'
            });
        }
        const verificationToken = generateToken({ email: user.email });
        user.verificationToken = verificationToken;
        await user.save();
        const verificationLink = process.env.VERIFICATION_LINK + verificationToken;
        sendMail(email, 'Verify your email', 'verification', { verificationLink });
        res.status(200).json({
            message: 'Verification link sent successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const resetToken = generateToken({ email: user.email });
        user.resetToken = resetToken;
        await user.save();
        const resetLink = process.env.RESET_LINK + resetToken;
        sendMail(email, 'Reset your password', 'reset', { resetLink });
        res.status(200).json({
            message: 'Reset link sent successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = verifyToken(token);
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const { password } = req.body;
        const hashedPassword = await encryptPassword(password);
        user.password = hashedPassword;
        user.resetToken = null;
        await user.save();
        res.status(200).json({
            message: 'Password reset successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { register, login, adminLogin, logout, verify, resendVerification, forgotPassword, resetPassword };