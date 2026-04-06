const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { updateCartItem } = require("../controllers/cart.controller");

const {
  addToCart,
  getCart,
  removeFromCart
} = require("../controllers/cart.controller");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/remove", authMiddleware, removeFromCart);
router.put("/update", authMiddleware, updateCartItem);
module.exports = router;