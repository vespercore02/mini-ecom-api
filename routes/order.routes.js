const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getOrders,
  getOrderById
} = require("../controllers/order.controller");

router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderById);

module.exports = router;