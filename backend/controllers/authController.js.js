const axios = require('axios');

// In-memory OTP store (Use Redis in production)
const otpStore = new Map();

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP with expiry
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  const url = `https://api.msg91.com/api/v5/flow/`;
  const payload = {
    flow_id: process.env.MSG91_TEMPLATE_ID,
    sender: process.env.MSG91_SENDER_ID,
    mobiles: `91${phone}`,
    OTP: otp,
  };

  try {
    await axios.post(url, payload, {
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        'Content-Type': 'application/json',
      },
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP', details: error.message });
  }
};

exports.verifyOtp = (req, res) => {
  const { phone, code } = req.body;
  const record = otpStore.get(phone);

  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'OTP expired or invalid' });
  }

  if (record.otp !== code) {
    return res.status(401).json({ error: 'Incorrect OTP' });
  }

  otpStore.delete(phone); // Cleanup

  // Proceed to login/signup logic
  res.json({ message: 'OTP verified successfully', verified: true });
};
