const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/:uid", cartController.getCart);
router.post("/add", cartController.addToCart);
router.post("/update", cartController.updateCart);
router.post("/remove", cartController.removeFromCart);
router.post("/checkout", cartController.checkoutCart);
router.delete("/clear/:uid", cartController.clearCart);

module.exports = router;