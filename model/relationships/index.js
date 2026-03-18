const User = require("../../models/User");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const CartItem = require("../../models/CartItem");
const Order = require("../../models/Order");
const OrderItem = require("../../models/OrderItem");

function setupRelationships() {

  // User → Cart
  User.hasOne(Cart, { foreignKey: "user_id" });
  Cart.belongsTo(User, { foreignKey: "user_id" });

  // Cart → Cart Items
  Cart.hasMany(CartItem, { foreignKey: "cart_id" });
  CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

  // Product → Cart Items
  Product.hasMany(CartItem, { foreignKey: "product_id" });
  CartItem.belongsTo(Product, { foreignKey: "product_id" });

  User.hasMany(Order, { foreignKey: "user_id" });
  Order.belongsTo(User, { foreignKey: "user_id" });

  // Order → OrderItems
  Order.hasMany(OrderItem, { foreignKey: "order_id" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id" });

  // Product → OrderItems
  Product.hasMany(OrderItem, { foreignKey: "product_id" });
  OrderItem.belongsTo(Product, { foreignKey: "product_id" });

}

module.exports = setupRelationships;