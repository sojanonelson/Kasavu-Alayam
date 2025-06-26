const Collection = require('../models/Collection');
const  Product = require('../models/Product.js')

exports.createCollection = async (req, res) => {
  try {
    const { title, categories } = req.body;
    const newCollection = await Collection.create({ title, categories });
    res.status(201).json(newCollection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().select('title').select('categories').populate('categories', 'name');;
    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCollectionsAndRoot = async (req, res) => {
  try {
    const collections = await Collection.find()
      .select('title categories')
      .populate({
        path: 'categories',
        select: 'name',
        populate: {
          path: 'subcategories', // Assuming 'subcategories' is the field in Category model
          select: 'name'
        }
      });

    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCollectionsOfId = async (req, res) => {
  const { id } = req.params;
  try {
    const collection = await Collection.findById(id)
      .select('title categories')
      .populate('categories', 'name');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getCollectionProducts = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const collection = await Collection.findById(collectionId).populate('categories');

    if (!collection) return res.status(404).json({ error: 'Collection not found' });

    const result = {};

    for (const category of collection.categories) {
      const products = await Product.find({ category: category._id }).limit(12);
      result[category.name] = products;
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
   const  { id } = req.params;
    await Collection.findByIdAndDelete(id);
    res.status(200).json({ message: 'Collection deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCollection = async (req, res) => {
  try {
   const  { id } = req.params;
    updated = await Collection.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getLowStockProductsInCollection = async (req, res) => {
  try {
    const { id: collectionId } = req.params;
    const threshold = parseInt(req.query.threshold) || 5; // default to 5 if not provided

    const collection = await Collection.findById(collectionId).populate('categories');
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const lowStockResult = {};

    for (const category of collection.categories) {
      const lowStockProducts = await Product.find({
        category: category._id,
        stockQuantity: { $lte: threshold }
      });

      if (lowStockProducts.length > 0) {
        lowStockResult[category.name] = lowStockProducts;
      }
    }

    res.status(200).json(lowStockResult);
  } catch (err) {
    console.error('Low stock fetch error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getLowStockCategoryNames = async (req, res) => {
  try {
    const { id: collectionId } = req.params;
    const threshold = parseInt(req.query.threshold) || 5;

    const collection = await Collection.findById(collectionId).populate('categories');
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const lowStockCategories = [];

    for (const category of collection.categories) {
      const lowStockExists = await Product.exists({
        category: category._id,
        stockQuantity: { $lte: threshold }
      });

      if (lowStockExists) {
        lowStockCategories.push(category.name);
      }
    }

    res.status(200).json(lowStockCategories);
  } catch (err) {
    console.error('Low stock category fetch error:', err);
    res.status(500).json({ error: err.message });
  }
};

