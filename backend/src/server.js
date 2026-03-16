const express = require("express");
const cors = require("cors");
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes")
const profileRoutes = require("./routes/profileRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/cart", cartRoutes);
app.use("/product", productRoutes);
app.use("/orders", orderRoutes)
app.use("/admin", adminRoutes)
app.use("/profile", profileRoutes);

app.listen(PORT, () => console.log("Running on localhost:5000"));