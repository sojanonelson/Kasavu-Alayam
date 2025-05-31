const Subcategory = require('../models/Subcategory');

exports.createSubcategory = async (req, res) => {
  const { name, categoryId } = req.body;
  const subcategory = await Subcategory.create({ name, category: categoryId });
  res.status(201).json(subcategory);
};

exports.getAllSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find().populate('category');
  res.json(subcategories);
};
