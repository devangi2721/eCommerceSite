const Product = require('../models/Product');

const createProductService = async ({ name, description, price, image ,category }) => {
  const product = new Product({ name, description, price, image ,category });
  await product.save();
  return product;
};

const updateProductService = async (id, { name, description, price, image }) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { name, description, price, image },
    { new: true }
  );
  return product;
};

module.exports = {
  createProductService,
  updateProductService,
}; 