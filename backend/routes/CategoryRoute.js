const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAdmin, protect } = require('../middleware/auth');

router.post('/',protect, isAdmin,  categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.put('/:id',protect, isAdmin,  categoryController.updateCategory);
router.delete('/:id',protect, isAdmin,  categoryController.deleteCategory);
router.get('/categories-with-subca  tegories', categoryController.getAllCategoriesWithSubcategories);

module.exports = router;
