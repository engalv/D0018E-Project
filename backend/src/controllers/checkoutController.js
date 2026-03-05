const conn = require("../database");

exports.checkoutCart = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ });
  }

  try {
    const [cartItems] = await conn.promise().query(
      "SELECT * FROM cart WHERE UID = ?",
      [uid]
    );

    if (cartItems.length === 0) {
      return res.status(400).json();
    }
      [
        uid,
        cartItems.reduce((acc, p) => acc + p.Price * p.Quantity, 0)
      ];

    await conn.promise().query("DELETE FROM cart WHERE UID = ?", [uid]);

  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
};