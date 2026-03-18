const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {

    const { name, price, stock } = req.body;

    const product = await Product.create({
      name,
      price,
      stock
    });

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

exports.getProducts = async (req, res) => {
  try {

    const products = await Product.findAll();

    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, price, stock } = req.body;

    await product.update({
      name,
      price,
      stock
    });

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    res.json({
      message: "Product deleted"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product" });
  }
};