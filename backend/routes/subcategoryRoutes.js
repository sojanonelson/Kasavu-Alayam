const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, isAdmin,  subcategoryController.createSubcategory);
router.get('/', subcategoryController.getAllSubcategories);

module.exports = router;
