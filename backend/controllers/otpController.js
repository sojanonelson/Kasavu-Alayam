const { sendOtpEmail, sendPasswordResetOtp } = require('../utils/nodeMailer');

// In-memory OTP store (Use Redis in production)
const otpStore = new Map();

exports.AccountVerify = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP with expiry (5 minutes)
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  try {
    await sendOtpEmail(email, otp);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email for account verification',
    });
  } catch (err) {
    console.error('OTP Email Send Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP email',
      error: err.message,
    });
  }
};

exports.ResetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP with expiry (5 mins)
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  try {
    await sendPasswordResetOtp(email, otp);
    res.json({ message: 'OTP sent successfully to your email for resetting password' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP email', error: err.message });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, code } = req.body;
  const record = otpStore.get(email);

  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: 'OTP expired or invalid' });
  }

  if (record.otp !== code) {
    return res.status(401).json({ message: 'Incorrect OTP' });
  }

  otpStore.delete(email); // Clean up after verification

  // Continue with login/signup flow here
  res.json({ message: 'OTP verified successfully', verified: true });
};
