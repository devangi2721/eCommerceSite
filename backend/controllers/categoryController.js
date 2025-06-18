const Category = require('../models/Category');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({isDeleted: { $ne: true }});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all categories
exports.getCategoriesForUser = async (req, res) => {
  try {
    const categories = await Category.find({isDeleted: { $ne: true }});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = new Category({ name, description, image });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, image },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
