const mongoose = require('mongoose');

const CarouselImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, default: "Welcome to Our Site" },
  subtitle: { type: String, default: "Your subtitle goes here." }
});

const WebsiteSettingSchema = new mongoose.Schema({
  carouselImages: [CarouselImageSchema],
  contact: {
    phone: { type: String },
    email: { type: String },
    location: { type: String }
  },
  underMaintenance: { type: Boolean, default: false },
  maintenanceTime: {
    start: { type: Date },
    end: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('WebsiteSetting', WebsiteSettingSchema);
