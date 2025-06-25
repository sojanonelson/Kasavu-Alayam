// routes/userRoutes.js
const express = require('express');
const {
  register,
  loginUser,
  deleteAccount,
  updateAccount,
  getAccountById,
  getAllAccounts,
  refreshAccessToken, // ✅ Add this
} = require('../controllers/userController');

const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// 🔐 Auth Routes
router.post('/register', register);
router.post('/login', loginUser);
router.get('/refresh', refreshAccessToken); // ✅ Refresh Token Route

// 👤 User Routes
router.delete('/:id', protect, deleteAccount);
router.put('/:id', protect, updateAccount);
router.get('/:id', protect, getAccountById);

// 🛡️ Admin Routes
router.get('/', protect, isAdmin, getAllAccounts);

module.exports = router;
