const conn = require("../database");

// Should add a get only one specific product function for pages where you potentially also can see reviews

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await conn.promise().query("SELECT * FROM product");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
};