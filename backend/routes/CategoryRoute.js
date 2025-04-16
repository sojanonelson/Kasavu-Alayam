const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', getCategories);
router.post('/',  createCategory);

module.exports = router;