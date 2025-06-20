const WebsiteSetting = require('../models/WebsiteSetting');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');





exports.updateContactInfo = async (req, res) => {
  try {
    const { phone, email, location } = req.body;
    const setting = await WebsiteSetting.findOne();
    const updated = setting
      ? await WebsiteSetting.findByIdAndUpdate(setting._id, { contact: { phone, email, location } }, { new: true })
      : await WebsiteSetting.create({ contact: { phone, email, location } });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update contact info' });
  }
};




exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { underMaintenance, maintenanceTimeStart, maintenanceTimeEnd } = req.body;
    console.log(maintenanceTimeStart)
    const setting = await WebsiteSetting.findOne();
    const updated = setting
      ? await WebsiteSetting.findByIdAndUpdate(
          setting._id,
          {
            underMaintenance,
            maintenanceTime: {
              start: maintenanceTimeStart,
              end: maintenanceTimeEnd,
            },
          },
          { new: true }
        )
      : await WebsiteSetting.create({
          underMaintenance,
          maintenanceTime: {
            start: maintenanceTimeStart,
            end: maintenanceTimeEnd,
          },
        });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update maintenance status' });
  }
};


exports.updateCarouselImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const uploadPromises = req.files.map((file, index) =>
      cloudinary.uploader.upload(file.path, {
        folder: "carousel",
        quality: "auto:good",
      }).then((result) => {
        fs.unlinkSync(file.path);
        return {
          public_id: result.public_id,
          url: result.secure_url,
          title: req.body.titles?.[index] || "",
          subtitle: req.body.subtitles?.[index] || ""
        };
      })
    );

    const images = await Promise.all(uploadPromises);
    const setting = await WebsiteSetting.findOneAndUpdate(
      {},
      { carouselImages: images }, // Replace all images
      { upsert: true, new: true }
    );

    res.status(200).json(setting);
  } catch (err) {
    console.error("Error updating carousel images:", err);
    res.status(500).json({ error: 'Failed to update carousel images' });
  }
};

exports.deleteMaintenanceStatus = async (req, res) => {
  try {
    const setting = await WebsiteSetting.findOneAndUpdate(
      {},
      { 
        underMaintenance: false,
        maintenanceTime: {
          start: null,
          end: null,
          alertAll: false
        }
      },
      { new: true }
    );
    
    if (!setting) {
      return res.status(404).json({ error: "Website settings not found" });
    }

    res.status(200).json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update maintenance status' });
  }
};


exports.getWebsiteSettings = async (req, res) => {
  try {
    const setting = await WebsiteSetting.findOne();
    if (!setting) {
      return res.status(404).json({ message: 'Website settings not found' });
    }
    res.status(200).json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch website settings' });
  }
};

exports.getCarouselImages = async (req, res) => {
  try {
    const setting = await WebsiteSetting.findOne();
    if (!setting || !setting.carouselImages) {
      return res.status(404).json({ message: 'No carousel images found' });
    }
    res.status(200).json({ images: setting.carouselImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch carousel images' });
  }
};

