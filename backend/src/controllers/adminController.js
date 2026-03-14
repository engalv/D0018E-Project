const conn = require("../database");

exports.getAllOrders = async (req, res) => {
  if (!req.user?.Is_Admin) return res.status(403).json({ error: "Forbidden" });

  const [orders] = await conn.promise().query("SELECT * FROM orders");
  res.json(orders);
};

exports.getAllProducts = async (req, res) => {
  if (!req.user?.Is_Admin) return res.status(403).json({ error: "Forbidden" });

  const [products] = await conn.promise().query("SELECT * FROM product");
  res.json(products);
};