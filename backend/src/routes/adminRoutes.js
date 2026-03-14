const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../authMiddleware");
const adminController = require("../controllers/adminController");

// Protect all admin routes
router.use(authenticate);
router.use(requireAdmin);

router.get("/orders", adminController.getAllOrders);
router.get("/products", adminController.getAllProducts);

module.exports = router;