const express = require("express");
const { pool } = require("../db");
const { auth } = require("../middleware/auth");

const router = express.Router();

// لیست تسک‌های خود کاربر
router.get("/", auth, async (req, res) => {
  const r = await pool.query(
    "SELECT id, title, completed, created_at FROM tasks WHERE user_id=$1 ORDER BY created_at DESC",
    [req.user.userId]
  );
  res.json(r.rows);
});

// ساخت تسک
router.post("/", auth, async (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: "title required" });

  const r = await pool.query(
    "INSERT INTO tasks(user_id, title) VALUES ($1,$2) RETURNING id, title, completed, created_at",
    [req.user.userId, title]
  );
  res.status(201).json(r.rows[0]);
});

// آپدیت تسک
router.patch("/:id", auth, async (req, res) => {
  const { title, completed } = req.body || {};
  const { id } = req.params;

  const r = await pool.query(
    `UPDATE tasks
     SET title = COALESCE($1, title),
         completed = COALESCE($2, completed)
     WHERE id=$3 AND user_id=$4
     RETURNING id, title, completed, created_at`,
    [title ?? null, completed ?? null, id, req.user.userId]
  );

  if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
  res.json(r.rows[0]);
});

// حذف تسک
router.delete("/:id", auth, async (req, res) => {
  const r = await pool.query(
    "DELETE FROM tasks WHERE id=$1 AND user_id=$2",
    [req.params.id, req.user.userId]
  );
  if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

module.exports = router;

