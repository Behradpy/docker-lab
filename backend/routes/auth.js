const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email/password required" });

  const password_hash = await bcrypt.hash(password, 12);

  try {
    const r = await pool.query(
      "INSERT INTO users(email, password_hash) VALUES ($1,$2) RETURNING id, email",
      [email.toLowerCase(), password_hash]
    );

    const user = r.rows[0];
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user });
  } catch (e) {
    if (String(e).includes("duplicate key")) return res.status(409).json({ error: "Email already exists" });
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email/password required" });

  const r = await pool.query("SELECT id, email, password_hash FROM users WHERE email=$1", [email.toLowerCase()]);
  const user = r.rows[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({ token, user: { id: user.id, email: user.email } });
});

module.exports = router;

