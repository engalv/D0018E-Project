const bcrypt = require("bcryptjs");
const conn = require("../database");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters" });

  try {
    const [existing] = await conn.promise().query(
      "SELECT UID FROM user WHERE Email = ?",
      [email]
    );

    if (existing.length)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await conn.promise().query(
      "INSERT INTO user (Name, Email, Password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await conn.promise().query(
      "SELECT * FROM user WHERE Email = ?",
      [email]
    );

    if (!results.length)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = results[0];

    const valid = await bcrypt.compare(password, user.Password);

    if (!valid)
      return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      user: {
        UID: user.UID,
        Name: user.Name,
        Is_Admin: user.Is_Admin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};