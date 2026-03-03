const conn = require("../database");

// 1. Get cart items
exports.getCart = async (req, res) => {
  const uid = req.params.uid;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );

    if (!cartRows.length) return res.json([]);

    const cartID = cartRows[0].CID;

    const [items] = await conn.promise().query(
      `SELECT ci.CIID, ci.PID, ci.Quantity, p.Name, p.Price, p.Stock
       FROM cart_item ci
       JOIN product p ON ci.PID = p.PID
       WHERE ci.CID = ?`,
      [cartID]
    );

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong when fetching the cart" });
  }
}

// 2. Add new product to cart
exports.addToCart = async (req, res) => {
  const { uid, pid, quantity } = req.body;

  try {
    const [productRows] = await conn.promise().query(
      "SELECT Stock FROM product WHERE PID = ?",
      [pid]
    );
    if (!productRows.length) return res.status(404).json({ error: "Product not found" });

    const stock = productRows[0].Stock;
    if (quantity > stock) return res.status(400).json({ error: "Not enough stock" });

    const cartID = await getActiveCartID(uid);

    const [cartItemRows] = await conn.promise().query(
      "SELECT Quantity FROM cart_item WHERE CID = ? AND PID = ?",
      [cartID, pid]
    );

    if (cartItemRows.length) {
      const newQuantity = cartItemRows[0].Quantity + quantity;
      if (newQuantity > stock) return res.status(400).json({ error: "Not enough stock" });

      await conn.promise().query(
        "UPDATE cart_item SET Quantity = ? WHERE CID = ? AND PID = ?",
        [newQuantity, cartID, pid]
      );
    } else {
      await conn.promise().query(
        "INSERT INTO cart_item (CID, PID, Quantity) VALUES (?, ?, ?)",
        [cartID, pid, quantity]
      );
    }

    res.json({ message: "Cart updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error when adding item to cart" });
  }
};

// 3. Update cart quantity
exports.updateCart = async (req, res) => {
  const { uid, pid, quantity } = req.body;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );
    if (!cartRows.length) return res.status(400).json({ error: "No active cart" });
    const cartID = cartRows[0].CID;

    const [productRows] = await conn.promise().query(
      "SELECT Stock FROM product WHERE PID = ?",
      [pid]
    );
    await conn.promise().query(
      "UPDATE cart_item SET Quantity = ? WHERE CID = ? AND PID = ?",
      [quantity, cartID, pid]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cart updating error" });
  }
};

// 4. Remove product from cart
exports.removeFromCart = async (req, res) => {
  const { uid, pid } = req.body;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );
    if (!cartRows.length) return res.status(400).json({ error: "No active cart" });

    const cartID = cartRows[0].CID;

    await conn.promise().query(
      "DELETE FROM cart_item WHERE CID = ? AND PID = ?",
      [cartID, pid]
    );
  } catch (err) {
    console.error(err);
  }
};

// 5. Checkout cart
exports.checkoutCart = async (req, res) => {
  const { uid } = req.body;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );
    if (!cartRows.length) return res.status(400).json({ error: "No active cart" });

    const cartID = cartRows[0].CID;

    const [items] = await conn.promise().query(
      `SELECT ci.PID, ci.Quantity, p.Stock
       FROM cart_item ci
       JOIN product p ON ci.PID = p.PID
       WHERE ci.CID = ?`,
      [cartID]
    );

    for (const item of items) {
      await conn.promise().query(
        "UPDATE product SET Stock = Stock - ? WHERE PID = ?",
        [item.Quantity, item.PID]
      );
    }

    await conn.promise().query(
      "UPDATE cart SET Status = 'inactive' WHERE CID = ?",
      [cartID]
    );

    res.json({ message: "Checkout successful" });
  } catch (err) {
    console.error(err);
  }
};

// 6. Clear cart
exports.clearCart = async (req, res) => {
  const uid = req.params.uid;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );
    if (!cartRows.length) return res.json({ message: "Cart already empty" });

    const cartID = cartRows[0].CID;

    await conn.promise().query(
      "DELETE FROM cart_item WHERE CID = ?",
      [cartID]
    );

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
  }
};

async function getActiveCartID(uid) {
  const [rows] = await conn.promise().query(
    "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
    [uid]
  );

  if (rows.length) return rows[0].CID;

  const [result] = await conn.promise().query(
    "INSERT INTO cart (UID, Status) VALUES (?, 'active')",
    [uid]
  );

  return result.insertId; // insertID is the primary key of the new cart (CID) 
}