const express = require('express');
const router = express.Router();
const { AccountVerify, verifyOtp,ResetPassword } = require('../controllers/otpController');

// Send OTP to email
router.post('/account-verify', AccountVerify);
router.post('/reset-password', ResetPassword);

// Verify OTP
router.post('/verify-otp', verifyOtp);

module.exports = router;
