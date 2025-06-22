const express = require('express');
const {
  register,
  getUserByPhone,
  deleteAccount,
  updateAccount,
  getAccountById,
  getAllAccounts
} = require('../controllers/userController');

const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Route to create a new account
router.post('/register', register);

// Route to look up a user by phone number
router.get('/lookup', getUserByPhone);

// Route to delete an account by ID
router.delete('/:id', protect, deleteAccount);

// Route to update an account by ID
router.put('/:id', protect, updateAccount);

// Route to get an account by ID
router.get('/:id', protect, getAccountById);

// Route to get all user accounts (only accessible by admin)
router.get('/', protect, isAdmin, getAllAccounts);

module.exports = router;
