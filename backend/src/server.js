const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/cart", cartRoutes);
app.use("/product", productRoutes);

app.listen(5000, () => console.log("Running on localhost:5000"));