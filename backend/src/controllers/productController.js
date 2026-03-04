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

exports.getSpecificProduct = async (req, res) => {
    const pid = req.params.pid;

    try {
        const [product] = await conn.promise().query(
            "SELECT * FROM product WHERE PID = ?",
            [pid]
        );

        if (!product.length) {
            return res.status(404).json({ error: "Product wasn't found."})
        }

        res.json(product[0]); // we get an array, send the product inside the array
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch product."})
    }
}


exports.addReview = async (req, res) => {
    const {uid, pid, rating, comment} = req.body;

    if (!uid || !pid || !rating) {
        return res.status(400).json({ error : "User, product or rating is missing."})
    }

    try {
        await conn.promise().query(
            "INSERT INTO review (PID, UID, Rating, Comment) VALUES (?, ?, ?, ?)",
            [pid, uid, rating, comment || null] // Comment text is not mandatory
        )
    } catch (err) {
        console.err(err)
        res.status(500).json({ error: "Failed to add review"})
    }
}


exports.getReviews = async (req, res) => {
    const pid = req.params.pid;

    try {
        const [reviews] = await conn.promise().query(
            `SELECT r.RID, r.Rating, r.Comment,
                    DATE_FORMAT(r.Creation_Time, '%Y-%m-%dT%H:%i:%sZ') AS Creation_Time,
                    u.Name AS UserName
             FROM review r
             JOIN user u ON r.UID = u.UID
             WHERE r.PID = ?
             ORDER BY r.Creation_Time DESC`,
            [pid]
        );
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "There is an error fetching the reviews."})
    }
}