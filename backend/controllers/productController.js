const Product = require('../models/Product');
const slugify = require('../utils/slugify');

exports.createProduct = async (req, res) => {
  try {
    const slug = slugify(req.body.name);

    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Product with similar name already exists.' });
    }

    const product = await Product.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find().populate('category');
  res.json(products);
};

exports.getProductBySlug = async (req, res) => {
    console.log(req.params.slug)
  const product = await Product.findOne({ categorySlug: req.params.slug }).populate('categorySlug');
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};