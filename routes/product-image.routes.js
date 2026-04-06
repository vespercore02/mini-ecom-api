const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  addProductImage,
  getProductImages,
  setCoverImage,
  deleteProductImage
} = require("../controllers/product-image.controller");

router.post("/:id/images", authMiddleware, adminMiddleware, addProductImage);
router.get("/:id/images", getProductImages);
router.put("/:id/images/:imageId/cover", authMiddleware, adminMiddleware, setCoverImage);
router.delete("/:id/images/:imageId", authMiddleware, adminMiddleware, deleteProductImage);

module.exports = router;