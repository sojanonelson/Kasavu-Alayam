// routes/userRoutes.js
const express = require("express");
const {
  register,
  loginUser,
  deleteAccount,
  updateAccount,
  getAccountById,
  getAllAccounts,
  refreshAccessToken, // ✅ Add this
  addAddress,
  deleteAddress,
  updateAddress,
  getAddresses,
} = require("../controllers/userController");

const { protect, isAdmin } = require("../middleware/auth");

const router = express.Router();

// 🔐 Auth Routes
router.post("/register", register);
router.post("/login", loginUser);
router.get("/refresh", refreshAccessToken); // ✅ Refresh Token Route

// 👤 User Routes
router.delete("/:id", protect, deleteAccount);
router.put("/:id", protect, updateAccount);
router.get("/:id", protect, getAccountById);

// 🛡️ Admin Routes
router.get("/", protect, isAdmin, getAllAccounts);

router.post("/address/add", addAddress);
router.delete("/address/delete", deleteAddress);
router.put("/address/update", updateAddress);
router.get("/address/:userId", getAddresses);

module.exports = router;
