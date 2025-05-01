const express = require('express');
const { register } = require('../controllers/accountController');
const { protect, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);

module.exports = router;