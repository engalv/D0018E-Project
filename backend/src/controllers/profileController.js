const conn = require("../database");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
    const uid = req.user.UID;
    try {
        const [rows] = await conn.promise().query(
        "SELECT UID, Name, Email FROM user WHERE UID = ?",
        [uid]
        );

        if (!rows.length) {
        return res.status(404).json({ error: "Användare ej funnen" });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error" });
    }
    };

    exports.updateEmail = async (req, res) => {
    const uid = req.user.UID;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Krävs en mejladress" });
    }

    try {

        const [existing] = await conn.promise().query(
        "SELECT UID FROM user WHERE Email = ?",
        [email]
        );

        if (existing.length) {
        return res.status(400).json({ error: "Mejladressen används redan" });
        }

        await conn.promise().query(
        "UPDATE user SET Email = ? WHERE UID = ?",
        [email, uid]
        );

        res.json({ message: "Mejladressen uppdaterad" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error" });
    }
    };

    exports.updatePassword = async (req, res) => {
    const uid = req.user.UID;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Saknas lösenord" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: "Lösenordet måste vara minst 6 karaktärer" });
    }

    try {

        const [rows] = await conn.promise().query(
        "SELECT Password FROM user WHERE UID = ?",
        [uid]
        );

        const user = rows[0];

        const valid = await bcrypt.compare(oldPassword, user.Password);

        if (!valid) {
        return res.status(401).json({ error: "Fel lösenord" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await conn.promise().query(
        "UPDATE user SET Password = ? WHERE UID = ?",
        [hashed, uid]
        );

        res.json({ message: "Lösenordet uppdaterat" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error" });
    }

};

exports.updateName = async (req, res) => {
    const uid = req.user.UID;
    const { name } = req.body;

    const [existing] = await conn.promise().query(
        "SELECT UID FROM user WHERE Name = ?",
        [name]
        );

        if (existing.length) {
            return res.status(400).json({ error: "Användarnamnet används redan" });
        }

    if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Namn krävs" });
    }

    try {
        await conn.promise().query(
        "UPDATE user SET Name = ? WHERE UID = ?",
        [name, uid]
        );
        res.json({ message: "Namn uppdaterad" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error" });
    }
};