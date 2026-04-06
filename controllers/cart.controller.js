const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {

    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    const cart = await Cart.findOne({
      where: { user_id: userId }
    });

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status !== "active") {
      return res.status(400).json({
        message: "Product is not available"
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Not enough stock"
      });
    }

    const existingItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id
      }
    });

    if (existingItem) {

      await existingItem.update({
        quantity: existingItem.quantity + quantity
      });

      return res.json(existingItem);

    }

    const item = await CartItem.create({
      cart_id: cart.id,
      product_id,
      quantity,
      price: product.price
    });

    res.json(item);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

exports.getCart = async (req, res) => {
  try {

    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: {
        model: CartItem,
        include: Product
      }
    });

    const validItems = [];
    const invalidItems = [];

    cart.CartItems.forEach(item => {
      if (item.Product.status !== "active" || item.Product.stock === 0) {
        invalidItems.push(item);
      } else {
        validItems.push(item);
      }
    });


    if (!cart) {
      return res.json({
        cart_id: null,
        items: [],
        totalItems: 0,
        subtotal: 0
      });
    }

    let subtotal = 0;
    let totalItems = 0;

    cart.CartItems.forEach(item => {
      subtotal += item.price * item.quantity;
      totalItems += item.quantity;
    });

    res.json({
      cart_id: cart.id,
      validItems,
      invalidItems,
      totalItems,
      subtotal
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });

  }
};

exports.removeFromCart = async (req, res) => {
  try {

    const userId = req.user.id;
    const { item_id } = req.body;

    const cart = await Cart.findOne({
      where: { user_id: userId }
    });

    const item = await CartItem.findOne({
      where: {
        id: item_id,
        cart_id: cart.id
      }
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.destroy();

    res.json({ message: "Item removed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing item" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {

    const userId = req.user.id;
    const { item_id, quantity } = req.body;

    const cart = await Cart.findOne({
      where: { user_id: userId }
    });

    const item = await CartItem.findOne({
      where: {
        id: item_id,
        cart_id: cart.id
      }
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const product = await Product.findByPk(item.product_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ If quantity = 0 → remove
    if (quantity <= 0) {
      await item.destroy();
      return res.json({ message: "Item removed" });
    }

    // ✅ Stock check
    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Not enough stock"
      });
    }

    await item.update({ quantity });

    res.json(item);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error updating cart" });

  }
};