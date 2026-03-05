const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getAllOrders);
router.get("/user/:uid", orderController.getOrderByUser);

module.exports = router;