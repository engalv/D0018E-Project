const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../authMiddleware");
const adminController = require("../controllers/adminController");

// Protect all admin routes
router.use(authenticate);
router.use(requireAdmin);

router.get("/orders", adminController.getAllOrders);
router.get("/products", adminController.getAllProducts);
router.get("/user/:uid/orders", adminController.getOrdersByUser);
router.get("/users", adminController.getAllUsers);
router.put("/order/:oid/status", adminController.updateOrderStatus);
router.post("/product", adminController.addProduct)
module.exports = router;
