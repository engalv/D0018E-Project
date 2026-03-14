const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticate } = require("../authMiddleware");

router.use(authenticate);

router.get("/", profileController.getProfile);
router.put("/email", profileController.updateEmail);
router.put("/password", profileController.updatePassword);
router.put("/name", profileController.updateName);

module.exports = router;