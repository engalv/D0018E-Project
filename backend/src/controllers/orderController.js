const conn = require("../database");


// Get all orders
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
        const [orders] = await conn.promise().query("SELECT * from orders WHERE uid = ?")
        [uid]
    } 
    
    
    
    
    catch (err) {

    }
}