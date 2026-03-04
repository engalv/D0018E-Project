const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.post("/review", productController.addReview);
router.get("/:pid/reviews", productController.getReviews); 
router.get("/:pid", productController.getSpecificProduct);

module.exports = router;