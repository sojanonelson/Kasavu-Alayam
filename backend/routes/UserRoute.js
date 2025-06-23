const express = require('express');
const {
  register,
  loginUser,
  deleteAccount,
  updateAccount,
  getAccountById,
  getAllAccounts
} = require('../controllers/userController');

const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Route to create a new account
router.post('/register', register);
router.post('/login', loginUser);



// Route to delete an account by ID
router.delete('/:id', deleteAccount);

// Route to update an account by ID
router.put('/:id', updateAccount);

// Route to get an account by ID
router.get('/:id', getAccountById);

// Route to get all user accounts (only accessible by admin)
router.get('/', protect, isAdmin, getAllAccounts);

module.exports = router;
