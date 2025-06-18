const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const collectionController = require('../controllers/collectionController.js');




router.post('/', collectionController.createCollection);
router.get('/', collectionController.getAllCollections);
router.get('/:id/products', collectionController.getCollectionProducts);
router.put('/:id', collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);
router.get('/:id/low-stock', collectionController.getLowStockProductsInCollection);
router.get('/:id/low-stock-categories', collectionController.getLowStockCategoryNames);

router.post('/', productController.getProductsByCollection);

module.exports = router;
