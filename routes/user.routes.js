const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getMe,
  updateMe,
  changePassword,
  updateUserStatus
} = require("../controllers/user.controller");

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.put("/change-password", authMiddleware, changePassword);

// admin only
router.put("/:id/status", authMiddleware, adminMiddleware, updateUserStatus);

module.exports = router;