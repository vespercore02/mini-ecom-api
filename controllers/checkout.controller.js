const sequelize = require("../config/database");

const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

exports.checkout = async (req, res) => {

  const transaction = await sequelize.transaction();

  try {

    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: {
        model: CartItem,
        include: Product
      },
      transaction
    });

    if (!cart || cart.CartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    cart.CartItems.forEach(item => {
      total += item.price * item.quantity;
    });

    const order = await Order.create({
      user_id: userId,
      total
    }, { transaction });

    for (const item of cart.CartItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }, { transaction });
    }

    // clear cart
    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction
    });

    await transaction.commit();

    res.json({
      message: "Checkout successful",
      order
    });

  } catch (error) {

    await transaction.rollback();

    console.error(error);

    res.status(500).json({
      message: "Checkout failed"
    });

  }
};