/*


/login
/register
/logout
/forgot-password
/reset-password
/verify/:token
/resend-verification


*/

const express = require('express');
const router = express.Router();
const { register, login, adminLogin, logout, forgotPassword, resetPassword, verify, resendVerification } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify/:token', verify);
router.get('/resend-verification', resendVerification);

module.exports = router;