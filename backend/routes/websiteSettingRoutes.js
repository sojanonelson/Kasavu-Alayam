const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // make sure this supports .single('image')
const controller = require("../controllers/websiteSettingController");

// Upload a single carousel image (image, title, subtitle)
router.post("/upload", upload.single("image"), controller.uploadCarouselImages);
router.put('/reorder', controller.reorderCarouselImages);

// Get all carousel images
router.get("/images", controller.getCarouselImages);

// Delete a carousel image by public_id
router.post("/delete", controller.deleteCarouselImage);

module.exports = router;
