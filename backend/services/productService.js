const Product = require('../models/Product');

const createProductService = async ({ name, price, image, category }) => {
  const product = new Product({ name, price, image, category });
  await product.save();
  return product;
};

const updateProductService = async (id, { name, price, image, category }) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { name, price, image, category },
    { new: true }
  );
  return product;
};

module.exports = {
  createProductService,
  updateProductService,
}; 