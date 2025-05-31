const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');

router.post('/', subcategoryController.createSubcategory);
router.get('/', subcategoryController.getAllSubcategories);

module.exports = router;
