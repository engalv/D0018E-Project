const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes")
const checkoutRoutes = require("./routes/checkoutRoutes");
const adminRoutes = require("./routes/adminRoutes")
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/cart", cartRoutes);
app.use("/product", productRoutes);
app.use("/orders", orderRoutes)
app.use("/checkout", checkoutRoutes);
app.use("/admin", adminRoutes)
app.use("/profile", profileRoutes);

app.listen(5000, () => console.log("Running on localhost:5000"));