const Handloom = require("../models/Handloom");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Upload handloom images
exports.uploadHandloomImages = async (req, res) => {
  try {
    const { title = "", description = "" } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "handlooms",
      quality: "auto:good",
    });

    fs.unlinkSync(file.path);

    const image = {
      url: result.secure_url,
      public_id: result.public_id,
      title,
      description,
    };

    const handloom = await Handloom.findOneAndUpdate(
      {},
      { $push: { images: image } },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Image uploaded successfully",
      image,
      handloom,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Get all handloom images
exports.getHandloomImages = async (req, res) => {
  try {
    const handloom = await Handloom.findOne({}, { images: 1 });
    res.status(200).json(handloom?.images || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch handloom images", error: err.message });
  }
};

// Delete specific handloom image by public_id
exports.deleteHandloomImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: "Missing publicId" });

    await cloudinary.uploader.destroy(publicId);

    const updatedHandloom = await Handloom.findOneAndUpdate(
      {},
      { $pull: { images: { public_id: publicId } } },
      { new: true }
    );

    res.status(200).json({ message: "Image deleted successfully", updatedHandloom });
  } catch (error) {
    res.status(500).json({ message: "Error deleting handloom image", error: error.message });
  }
};

// Reorder handloom images
exports.reorderHandloomImages = async (req, res) => {
  try {
    const { orderedPublicIds } = req.body;

    if (!Array.isArray(orderedPublicIds)) {
      return res.status(400).json({ message: "orderedPublicIds must be an array" });
    }

    const handloom = await Handloom.findOne({});
    if (!handloom) {
      return res.status(404).json({ message: "Handloom settings not found" });
    }

    const imageMap = new Map();
    handloom.images.forEach(img => imageMap.set(img.public_id, img));

    const orderedImages = orderedPublicIds
      .map(id => imageMap.get(id))
      .filter(img => img !== undefined);

    if (orderedImages.length !== handloom.images.length) {
      return res.status(400).json({
        message: "Some image IDs don't exist in current handlooms",
        missingIds: handloom.images
          .filter(img => !orderedPublicIds.includes(img.public_id))
          .map(img => img.public_id)
      });
    }

    handloom.images = orderedImages;
    await handloom.save();

    res.status(200).json({
      success: true,
      message: "Handloom images reordered successfully",
      images: handloom.images
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
