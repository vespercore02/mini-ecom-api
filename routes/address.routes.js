const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress
} = require("../controllers/address.controller");

router.post("/", authMiddleware, createAddress);
router.get("/", authMiddleware, getAddresses);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);

module.exports = router;