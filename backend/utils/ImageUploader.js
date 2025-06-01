const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');


const uploadImagesToCloudinary = async (files) => {
  return Promise.all(
    files.map(async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          use_filename: true,
          unique_filename: false,
        });
        await fs.promises.unlink(file.path);
        return { url: result.secure_url, public_id: result.public_id };
      } catch (error) {
        console.error(`Error uploading file ${file.path}:`, error);
        // Optionally delete file even on failure
        if (fs.existsSync(file.path)) {
          await fs.promises.unlink(file.path);
        }
        throw error; // Or return a fallback object if you want to continue
      }
    })
  );
};


module.exports = {
  uploadImagesToCloudinary,
};
