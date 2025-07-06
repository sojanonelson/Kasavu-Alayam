const WebsiteSetting = require("../models/WebsiteSetting");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.uploadCarouselImages = async (req, res) => {
  console.log("IMAGE UPLOAD")
  try {
    const { title = "", subtitle = "" } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "carousel",
      quality: "auto:good",
    });

    fs.unlinkSync(file.path);

    const image = {
      url: result.secure_url,
      public_id: result.public_id,
      title,
      subtitle,
    };

    const setting = await WebsiteSetting.findOneAndUpdate(
      {},
      { $push: { carouselImages: image } },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Image uploaded successfully",
      image,
      setting,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};


// Get all carousel images
exports.getCarouselImages = async (req, res) => {
  console.log("Get Carousel")
  try {
    const setting = await WebsiteSetting.findOne({}, { carouselImages: 1 });
    res.status(200).json(setting?.carouselImages || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch carousel images", error: err.message });
  }
};

// Delete specific carousel image by public_id
exports.deleteCarouselImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: "Missing publicId" });

    await cloudinary.uploader.destroy(publicId);

    const updatedSetting = await WebsiteSetting.findOneAndUpdate(
      {},
      { $pull: { carouselImages: { public_id: publicId } } },
      { new: true }
    );

    res.status(200).json({ message: "Image deleted successfully", updatedSetting });
  } catch (error) {
    res.status(500).json({ message: "Error deleting carousel image", error: error.message });
  }
};


exports.reorderCarouselImages = async (req, res) => {
  try {
    const { orderedPublicIds } = req.body;
    
    // Validate input
    if (!Array.isArray(orderedPublicIds) ){
      return res.status(400).json({ message: "orderedPublicIds must be an array" });
    }

    const setting = await WebsiteSetting.findOne({});
    if (!setting) {
      return res.status(404).json({ message: "Settings not found" });
    }

    // Create a map for quick lookup
    const imageMap = new Map();
    setting.carouselImages.forEach(img => imageMap.set(img.public_id, img));

    // Rebuild the array in the new order, preserving only valid IDs
    const orderedImages = orderedPublicIds
      .map(id => imageMap.get(id))
      .filter(img => img !== undefined);

    // Verify we have all images
    if (orderedImages.length !== setting.carouselImages.length) {
      return res.status(400).json({
        message: "Some image IDs don't exist in current carousel",
        missingIds: setting.carouselImages
          .filter(img => !orderedPublicIds.includes(img.public_id))
          .map(img => img.public_id)
      });
    }

    // Update the setting
    setting.carouselImages = orderedImages;
    await setting.save();

    res.status(200).json({ 
      success: true,
      message: "Carousel images reordered successfully",
      images: setting.carouselImages 
    });
  } catch (err) {
    console.error("Reorder Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to reorder images", 
      error: err.message 
    });
  }
};