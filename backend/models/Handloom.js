const mongoose = require('mongoose');

const handloomSchema = new mongoose.Schema({
  images: [{
    url: String,
    public_id: String,
    title: String,
    description: String
  }]
});

module.exports = mongoose.model('Handloom', handloomSchema);
