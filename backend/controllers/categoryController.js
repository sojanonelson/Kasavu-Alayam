const Category = require('../models/Category');
const slugify = require('../utils/slugify');

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const categorySlug = slugify(name);

  try {
    const category = await Category.create({ name, categorySlug });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};