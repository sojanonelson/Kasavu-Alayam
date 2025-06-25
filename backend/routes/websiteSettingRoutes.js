const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // make sure this supports .single('image')
const controller = require("../controllers/websiteSettingController");
const { protect, isAdmin } = require('../middleware/auth');


// Upload a single carousel image (image, title, subtitle)
router.post("/upload",protect,isAdmin, upload.single("image"), controller.uploadCarouselImages);
router.put('/reorder',protect,isAdmin, controller.reorderCarouselImages);

// Get all carousel images
router.get("/images", controller.getCarouselImages);

// Delete a carousel image by public_id
router.post("/delete",protect,isAdmin,  controller.deleteCarouselImage);

module.exports = router;
