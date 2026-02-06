const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

app.set("trust proxy", true);
app.use(express.json());

// اگر nginx همه چیز رو یکجا سرو می‌کند، این اوکیه. بعداً می‌تونی محدودش کنی.
app.use(cors({ origin: true }));

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "db_error" });
  }
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

