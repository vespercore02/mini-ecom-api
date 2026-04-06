const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");

exports.getOrders = async (req, res) => {
  try {

    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: {
        model: OrderItem,
        include: Product
      },
      order: [["createdAt", "DESC"]]
    });

    res.json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {

    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({
      where: {
        id,
        user_id: userId   // ✅ ownership check
      },
      include: {
        model: OrderItem,
        include: Product
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching order" });
  }
};