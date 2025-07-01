const express = require('express');
const router = express.Router();
const handloomController = require('../controllers/handloomController');
const upload = require('../config/multer');

router.post('/upload', upload.single('image'), handloomController.uploadHandloomImages);
router.get('/images', handloomController.getHandloomImages);
router.post('/delete', handloomController.deleteHandloomImage);
router.put('/reorder', handloomController.reorderHandloomImages);

module.exports = router;
