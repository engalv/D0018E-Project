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

exports.getOrdersByUser = async (req, res) => {
  const uid = req.params.uid;

  try {
    const [rows] = await conn.promise().query(
      `SELECT o.OID, o.Status, o.Creation_Time,
              oi.PID, oi.Product_Name, oi.Price, oi.Amount
       FROM orders o
       JOIN order_items oi ON o.OID = oi.OID
       WHERE o.UID = ?
       ORDER BY o.Creation_Time DESC`,
      [uid]
    );

    // Group items by order
    const orders = {};
    rows.forEach(row => {
      if (!orders[row.OID]) {
        orders[row.OID] = {
          OID: row.OID,
          Status: row.Status,
          Creation_Time: row.Creation_Time,
          items: [],
        };
      }
      orders[row.OID].items.push({
        PID: row.PID,
        Product_Name: row.Product_Name,
        Amount: row.Amount,
        Price: row.Price
      });
    });

    res.json(Object.values(orders)); // Send as array of orders
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user's orders." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await conn.promise().query(
      "SELECT UID, Name, Email, Is_Admin FROM user"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

exports.updateOrderStatus = async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "completed", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const [result] = await conn.promise().query(
      "UPDATE orders SET Status = ? WHERE OID = ?",
      [status, oid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order status updated", OID: oid, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

exports.addProduct = async (req, res) => {
  const {Name, Price, Description, Cover_Image, Stock, CID} = req.body;

  if (!Name || Price === undefined || !Description || !Cover_Image || !Stock || !CID) {
    return res.status(400).json({ error: "Missing input field."})
  }



  try {
    const [alreadyexists] = await conn.promise().query(
      `SELECT PID FROM product where NAME = ?`,
      [Name]
    )

    if (alreadyexists.length > 0) {
      return res.status(400).json({ error: "A product with this name already exists." })
    }

    const [result] = await conn.promise().query(
      `INSERT INTO product (Name, Price, Description, Cover_Image, Stock, CID)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [Name, Price, Description, Cover_Image, Stock, CID]
    )

    const [rows] = await conn.promise().query(
      "SELECT * FROM product WHERE PID = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Failed to add product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }

}