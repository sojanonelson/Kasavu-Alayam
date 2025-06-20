const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const controller = require('../controllers/websiteSettingController');

router.get('/', controller.getWebsiteSettings);
router.get('/carousel-images', controller.getCarouselImages);
router.post('/carousel', upload.array('carouselImages', 5), controller.updateCarouselImages);
router.post('/contact', controller.updateContactInfo);
router.post('/maintenance', controller.updateMaintenanceStatus);
router.put('/maintenance', controller.updateMaintenanceStatus);
router.delete('/carousel', controller.deleteMaintenanceStatus)

module.exports = router;