const Account = require('../models/accountModel');
const authMiddleware = require('../middlewares/authMiddleware');

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      authenticationToken,
      phone,
      email,
      address,
      pincode,
      city,
      state
    } = req.body;

    const profilePicture = req.file ? req.file.path : null;

    const newAccount = new Account({
      firstName,
      lastName,
      gender,
      profilePicture,
      authenticationToken,
      phone,
      email,
      address,
      pincode,
      city,
      state
    });

    await newAccount.save();

    res.status(201).json({ message: 'Account registered successfully', account: newAccount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register account' });
  }
};
