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

exports.getProductsCategory = async (req, res) => {
  const cid = req.params.cid;

  try {
    const [products] = await conn.promise().query(
      "SELECT * FROM product WHERE CID = ?",
      [cid]
    );

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product," });
  }
};


exports.addReview = async (req, res) => {
    const {uid, pid, rating, comment} = req.body;

    if (!uid || !pid || !rating) {
        return res.status(400).json({ error : "User, product or rating is missing."})
    }

    try {
        const [orders] = await conn.promise().query(
            `SELECT oi.* 
             FROM order_items oi
             JOIN orders o ON o.OID = oi.OID
             WHERE o.UID = ? AND oi.PID = ?`,
            [uid, pid]
        );

        if (orders.length === 0) {
            return res.status(403).json({ error: "You can only review products you have purchased." });
        }
        const [existing] = await conn.promise().query(
            "SELECT * FROM review WHERE PID = ? AND UID = ?",
            [pid, uid]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                error: "User has already reviewed this product."
            });
        }

        const [result] = await conn.promise().query(
            "INSERT INTO review (PID, UID, Rating, Comment) VALUES (?, ?, ?, ?)",
            [pid, uid, rating, comment || null] // Comment text is not mandatory
        )

        res.status(201).json({
            message: "Review added",
            RID: result.insertId
        })
    } catch (err) {
        console.error(err)
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

exports.addProduct = async (req, res) => {
    const {Name, Price, Description, Cover_Image, Stock, CID} = req.body;

    if (!Name || Price == null || Stock == null || CID == null || !Description) {
        return res.status(400).json({
            error: "Name, price, stock or category ID missing."
         })
    }

    try {
        const [result] = await conn.promise().query(
            `INSERT INTO product (Name, Price, Description, Cover_Image, Stock, CID)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [Name, Price, Description, Cover_Image || null, Stock, CID]
        )

        res.status(201).json({
            message: "Product created",
            PID: result.insertId
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to create product."})
    }
    
     
}
