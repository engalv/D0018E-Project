const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate, requireAdmin } = require("../authMiddleware"); 

router.get("/", productController.getAllProducts);
router.post("/review", productController.addReview);
router.get("/:pid/reviews",productController.getReviews); 
router.get("/:pid", productController.getSpecificProduct);
router.get("/category/:cid", productController.getProductsCategory);
// Admin routes
router.post("/", authenticate, requireAdmin, productController.addProduct);
//router.put("/:pid", authenticate, requireAdmin, productController.updateProduct);
//router.delete("/:pid", authenticate, requireAdmin, productController.deleteProduct);

module.exports = router;