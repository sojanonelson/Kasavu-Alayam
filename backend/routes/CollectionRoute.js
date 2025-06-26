const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const collectionController = require('../controllers/collectionController.js');
const { protect, isAdmin } = require('../middleware/auth.js');




router.post('/', collectionController.createCollection);
router.get('/', collectionController.getAllCollections);
router.get('/main', collectionController.getAllCollectionsAndRoot)
router.get('/:id', collectionController.getAllCollectionsOfId);
router.get('/:id/products', collectionController.getCollectionProducts);

router.put('/:id',protect, isAdmin,  collectionController.updateCollection);
router.delete('/:id',protect, isAdmin,  collectionController.deleteCollection);
router.get('/:id/low-stock',protect, isAdmin,  collectionController.getLowStockProductsInCollection);
router.get('/:id/low-stock-categories',protect, isAdmin,  collectionController.getLowStockCategoryNames);

router.post('/', productController.getProductsByCollection);

module.exports = router;
