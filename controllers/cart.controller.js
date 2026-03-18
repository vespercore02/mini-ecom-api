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

    console.log("Existing item:", existingItem);
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

    let subtotal = 0;
    let totalItems = 0;

    cart.CartItems.forEach(item => {
      subtotal += item.price * item.quantity;
      totalItems += item.quantity;
    });

    res.json({
      cart_id: cart.id,
      items: cart.CartItems,
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

    const { item_id } = req.body;

    const item = await CartItem.findByPk(item_id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.destroy();

    res.json({
      message: "Item removed"
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error removing item" });

  }
};