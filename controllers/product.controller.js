const { Op } = require("sequelize");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const formatProduct = require("../utils/formatProduct");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({
        message: "Name, price, and stock are required"
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative"
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative"
      });
    }

    const product = await Product.create({
      name,
      price,
      stock
    });

    res.status(201).json({
      message: "Product created successfully",
      product: formatProduct(product)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    limit = Math.min(limit, 50);

    const offset = (page - 1) * limit;

    const whereCondition = {
      status: "active",
      ...(search && {
        name: {
          [Op.like]: `%${search}%`
        }
      })
    };

    const { count, rows } = await Product.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: ProductImage,
          required: false,
          attributes: ["id", "image_url", "is_cover", "sort_order", "createdAt", "updatedAt"]
        }
      ]
    });

    const formattedProducts = rows.map(product => formatProduct(product));

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      products: formattedProducts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        status: "active"
      },
      include: [
        {
          model: ProductImage,
          required: false,
          attributes: ["id", "image_url", "is_cover", "sort_order", "createdAt", "updatedAt"]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(formatProduct(product, true));

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

    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative"
      });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative"
      });
    }

    await product.update({
      name: name ?? product.name,
      price: price ?? product.price,
      stock: stock ?? product.stock
    });

    res.json({
      message: "Product updated successfully",
      product: formatProduct(product)
    });

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

    await product.update({
      status: "inactive"
    });

    res.json({
      message: "Product deactivated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deactivating product" });
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["active", "inactive"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({ status });

    res.json({
      message: "Product status updated successfully",
      product: formatProduct(product)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product status" });
  }
};