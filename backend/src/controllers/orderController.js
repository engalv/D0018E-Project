const conn = require("../database");

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await conn.promise().query("SELECT * FROM orders");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
};

exports.getOrderByUser = async (req, res) => {
  const uid = req.params.uid;

  try {
    const [orders] = await conn
      .promise()
      .query("SELECT * FROM orders WHERE UID = ?", [uid]);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    const orderIds = orders.map(order => order.OID);

    if (orderIds.length > 0) {
      const [items] = await conn
        .promise()
        .query("SELECT * FROM order_items WHERE OID IN (?)", [orderIds]);

      orders.forEach(order => {
        order.items = items.filter(item => item.OID === order.OID);
      });
    }

    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user orders" });
  }
};