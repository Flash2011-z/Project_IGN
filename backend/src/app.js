/*
  app.js (FULL WORKING BACKEND)
  - Express + PostgreSQL (pool)
  - CORS enabled for frontend
  - Game APIs: /games, /games/:id, /games-with-publisher
  - DB test: /db-test
  - Auth APIs (Table: user_account): /auth/register, /auth/login
*/

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./config/db");

const app = express();

/* Allow frontend to call backend */
app.use(cors());
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.send("GameZone API is running");
});

/* Quick DB check */
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Games with publisher */
app.get("/games-with-publisher", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        g.game_id,
        g.title,
        g.release_year,
        p.publisher_name
      FROM game g
      JOIN publisher p ON g.publisher_id = p.publisher_id
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Single game details */
app.get("/games/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        g.game_id AS id,
        g.title,
        g.subtitle,
        g.avg_score AS score,
        g.release_year AS year,
        g.description,
        g.cover_url,
        g.accent_color,
        ARRAY_AGG(DISTINCT genre.genre_name) AS genres,
        ARRAY_AGG(DISTINCT platform.platform_name) AS platforms
      FROM game g
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre ON gg.genre_id = genre.genre_id
      LEFT JOIN game_platform gp ON g.game_id = gp.game_id
      LEFT JOIN platform ON gp.platform_id = platform.platform_id
      WHERE g.game_id = $1
      GROUP BY g.game_id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /games/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* Games list */
app.get("/games", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.game_id AS id,
        g.title,
        g.subtitle,
        g.avg_score AS score,
        g.release_year AS year,
        g.description,
        g.cover_url AS cover,
        g.accent_color AS accent,
        ARRAY_AGG(DISTINCT genre.genre_name) AS genres,
        ARRAY_AGG(DISTINCT platform.platform_name) AS platforms
      FROM game g
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre ON gg.genre_id = genre.genre_id
      LEFT JOIN game_platform gp ON g.game_id = gp.game_id
      LEFT JOIN platform ON gp.platform_id = platform.platform_id
      GROUP BY g.game_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("GET /games error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   AUTH (user_account)
   Columns: user_id, username, email, password_hash, join_date
   ========================= */

/* Register */
app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email, password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const exists = await pool.query(
      "SELECT 1 FROM user_account WHERE email = $1 LIMIT 1",
      [email]
    );
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await pool.query(
      `INSERT INTO user_account (username, email, password_hash, join_date)
       VALUES ($1, $2, $3, NOW())
       RETURNING user_id, username, email, join_date`,
      [username, email, passwordHash]
    );

    return res.status(201).json({ user: created.rows[0] });
  } catch (err) {
    console.error("POST /auth/register error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* Login */
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const result = await pool.query(
      `SELECT user_id, username, email, password_hash, join_date
       FROM user_account
       WHERE email = $1
       LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash || "");

    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        join_date: user.join_date,
      },
    });
  } catch (err) {
    console.error("POST /auth/login error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = app;
