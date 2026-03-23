/*
  app.js (FULL WORKING BACKEND)
  - Express + PostgreSQL (pool)
  - CORS enabled for frontend
  - Game APIs: /games, /games/:id, /games-with-publisher
  - DB test: /db-test
  - Auth APIs (Table: user_account): /auth/register, /auth/login
  - Home APIs
  - Wishlist APIs
  - Profile API
  - Shop APIs
  - Cart APIs
*/
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./config/db");
const path = require("path");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-change-this";
const JWT_EXPIRES_IN = "7d";

function signToken(user) {
  return jwt.sign(
    {
      id: user.user_id ?? user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.authUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireSameUser(req, res, next) {
  const routeUserId = parseInt(
    req.params.userId || req.params.id,
    10
  );

  if (Number.isNaN(routeUserId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  if (!req.authUser || Number(req.authUser.id) !== routeUserId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
}

/* Allow frontend to call backend */
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

async function getOrCreateCart(userId) {
  const existing = await pool.query(
    "SELECT cart_id FROM cart WHERE user_id = $1 ORDER BY cart_id ASC LIMIT 1",
    [userId]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].cart_id;
  }

  const created = await pool.query(
    `
    INSERT INTO cart (user_id, created_at)
    VALUES ($1, NOW())
    RETURNING cart_id
    `,
    [userId]
  );

  return created.rows[0].cart_id;
}

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
        p.name AS publisher_name
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
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid game id" });
    }

    const gameResult = await pool.query(
      `
      SELECT
        g.game_id AS id,
        g.title,
        g.subtitle,
        g.avg_score AS score,
        g.release_year AS year,
        g.description,
        g.cover_url AS cover,
        g.accent_color AS accent,
        p.name AS publisher,
        COALESCE(
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT genre.genre_name), NULL),
          '{}'
        ) AS genres,
        COALESCE(
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT platform.platform_name), NULL),
          '{}'
        ) AS platforms
      FROM game g
      LEFT JOIN publisher p ON g.publisher_id = p.publisher_id
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre ON gg.genre_id = genre.genre_id
      LEFT JOIN game_platform gp ON g.game_id = gp.game_id
      LEFT JOIN platform ON gp.platform_id = platform.platform_id
      WHERE g.game_id = $1
      GROUP BY g.game_id, p.name
      `,
      [id]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const listings = await pool.query(
      `
      SELECT
        gsl.listing_id,
        gsl.price,
        gsl.currency,
        gsl.stock_status,
        s.name AS store_name
      FROM game_store_listing gsl
      LEFT JOIN store s ON gsl.store_id = s.store_id
      WHERE gsl.game_id = $1
      `,
      [id]
    );

    return res.json({
      ...gameResult.rows[0],
      listings: listings.rows,
    });
  } catch (err) {
    console.error("GET /games/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GAME REVIEWS
   ========================= */

/* Get all reviews for one game */
app.get("/games/:id/reviews", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id, 10);

    if (Number.isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid game id" });
    }

    const gameExists = await pool.query(
      "SELECT 1 FROM game WHERE game_id = $1 LIMIT 1",
      [gameId]
    );

    if (gameExists.rowCount === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const result = await pool.query(
      `
      SELECT
        ur.user_review_id AS id,
        ur.user_id AS "userId",
        ua.username AS user,
        ur.game_id AS "gameId",
        ur.review_text AS text,
        ur.score,
        ur.review_date AS date
      FROM user_review ur
      JOIN user_account ua ON ur.user_id = ua.user_id
      WHERE ur.game_id = $1
      ORDER BY ur.review_date DESC
      `,
      [gameId]
    );

    const reviews = result.rows.map((row) => ({
      ...row,
      avatar: `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(
        row.user || "Player"
      )}`,
    }));

    return res.json(reviews);
  } catch (err) {
    console.error("GET /games/:id/reviews error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* Write a review for one game */
app.post("/games/:id/reviews", requireAuth, async (req, res) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const userId = Number(req.authUser?.id);
    const score = parseFloat(req.body.score);
    const reviewText = String(req.body.reviewText || "").trim();

    if (Number.isNaN(gameId) || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid game id or user id" });
    }

    if (Number.isNaN(score) || score < 0 || score > 10) {
      return res.status(400).json({ error: "Score must be between 0 and 10" });
    }

    if (reviewText.length < 10) {
      return res.status(400).json({ error: "Review text must be at least 10 characters" });
    }

    const gameExists = await pool.query(
      "SELECT 1 FROM game WHERE game_id = $1 LIMIT 1",
      [gameId]
    );

    if (gameExists.rowCount === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const userExists = await pool.query(
      "SELECT 1 FROM user_account WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (userExists.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingReview = await pool.query(
      `
      SELECT user_review_id
      FROM user_review
      WHERE user_id = $1 AND game_id = $2
      LIMIT 1
      `,
      [userId, gameId]
    );

    if (existingReview.rowCount > 0) {
      return res.status(409).json({ error: "You already reviewed this game" });
    }

    const created = await pool.query(
      `
      INSERT INTO user_review (user_id, game_id, review_text, score, review_date)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING user_review_id AS id
      `,
      [userId, gameId, reviewText, score]
    );

    await pool.query(
      `
      UPDATE game
      SET avg_score = (
        SELECT ROUND(AVG(score)::numeric, 1)
        FROM user_review
        WHERE game_id = $1
      )
      WHERE game_id = $1
      `,
      [gameId]
    );

    return res.status(201).json({
      ok: true,
      id: created.rows[0].id,
      message: "Review submitted successfully",
    });
  } catch (err) {
    console.error("POST /games/:id/reviews error:", err);

    if (err.code === "23505") {
      return res.status(409).json({ error: "You already reviewed this game" });
    }

    return res.status(500).json({ error: err.message });
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
        g.cover_url AS cover,
        g.accent_color AS accent,
        p.name AS developer,
        COALESCE(
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT genre.genre_name), NULL),
          '{}'
        ) AS genres,
        COALESCE(
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT platform.platform_name), NULL),
          '{}'
        ) AS platforms
      FROM game g
      LEFT JOIN publisher p ON g.publisher_id = p.publisher_id
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre ON gg.genre_id = genre.genre_id
      LEFT JOIN game_platform gp ON g.game_id = gp.game_id
      LEFT JOIN platform ON gp.platform_id = platform.platform_id
      GROUP BY g.game_id, p.name
      ORDER BY g.game_id ASC
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

const AVATAR_STYLES = [
  "adventurer",
  "adventurer-neutral",
  "avataaars",
  "big-smile",
  "bottts",
  "fun-emoji",
  "icons",
  "lorelei",
  "micah",
  "shapes",
];

function pickRandomAvatarStyle() {
  return AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
}

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

    const avatarStyle = pickRandomAvatarStyle();
    const avatarSeed = username;

    const created = await pool.query(
      `INSERT INTO user_account
       (username, email, password_hash, join_date, avatar_style, avatar_seed, bio)
       VALUES ($1, $2, $3, NOW(), $4, $5, '')
       RETURNING user_id, username, email, join_date, avatar_style, avatar_seed, bio`,
      [username, email, passwordHash, avatarStyle, avatarSeed]
    );

    const u = created.rows[0];

const token = signToken(u);

return res.status(201).json({
  token,
  user: {
    id: u.user_id,
    name: u.username,
    email: u.email,
    join_date: u.join_date,
    avatar_style: u.avatar_style,
    avatar_seed: u.avatar_seed,
    bio: u.bio,
  },
});
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
  `
  SELECT
    user_id,
    username,
    email,
    password_hash,
    join_date,
    COALESCE(avatar_style, 'adventurer') AS avatar_style,
    COALESCE(avatar_seed, username) AS avatar_seed,
    COALESCE(bio, '') AS bio
  FROM user_account
  WHERE email = $1
  LIMIT 1
  `,
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

const token = signToken(user);

return res.json({
  token,
  user: {
    id: user.user_id,
    name: user.username,
    email: user.email,
    join_date: user.join_date,
    avatar_style: user.avatar_style,
    avatar_seed: user.avatar_seed,
    bio: user.bio,
  },
});
  } catch (err) {
    console.error("POST /auth/login error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   HOME
   ========================= */

app.get("/home/hero", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        g.game_id AS id,
        g.title,
        g.subtitle,
        g.avg_score AS score,
        g.cover_url AS cover,
        g.accent_color AS accent
      FROM game g
      ORDER BY g.avg_score DESC
      LIMIT 1
    `);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/home/featured", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        g.game_id AS id,
        g.title,
        g.subtitle,
        g.avg_score AS score,
        g.cover_url AS cover,
        g.accent_color AS accent
      FROM game g
      ORDER BY g.avg_score DESC
      LIMIT 3
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/home/reviews", async (req, res) => {
  const AVATARS = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=NeoKnight",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=CyberSamurai",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=ShadowNinja",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=PixelWarrior",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=ArcaneMage"
  ];

  try {
    const result = await pool.query(`
      SELECT 
        ur.user_review_id AS id,
        ur.user_id,
        u.username AS user,
        ur.game_id AS "gameId",
        g.title AS game,
        ur.review_text AS text,
        ur.score,
        ur.review_date AS date,
        g.accent_color AS accent
      FROM user_review ur
      JOIN user_account u ON ur.user_id = u.user_id
      JOIN game g ON ur.game_id = g.game_id
      ORDER BY ur.review_date DESC
      LIMIT 5
    `);

    const reviewsWithAvatar = result.rows.map((r) => ({
      ...r,
      avatar: AVATARS[r.user_id % AVATARS.length]
    }));

    res.json(reviewsWithAvatar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   WISHLIST
   ========================= */

/* =========================
   WISHLIST
   ========================= */

app.get("/wishlist/:userId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const userExists = await pool.query(
      "SELECT 1 FROM user_account WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (userExists.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await pool.query(
      `
      SELECT
        g.game_id AS id,
        g.title,
        g.subtitle,
        g.avg_score AS score,
        g.release_year AS year,
        g.cover_url AS cover,
        g.accent_color AS accent,
        p.name AS developer,
        COALESCE(
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT genre.genre_name), NULL),
          '{}'
        ) AS genres,
        COALESCE(
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT platform.platform_name), NULL),
          '{}'
        ) AS platforms,
        w.added_date
      FROM wishlist w
      JOIN game g ON w.game_id = g.game_id
      LEFT JOIN publisher p ON g.publisher_id = p.publisher_id
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre ON gg.genre_id = genre.genre_id
      LEFT JOIN game_platform gp ON g.game_id = gp.game_id
      LEFT JOIN platform ON gp.platform_id = platform.platform_id
      WHERE w.user_id = $1
      GROUP BY
        g.game_id,
        g.title,
        g.subtitle,
        g.avg_score,
        g.release_year,
        g.cover_url,
        g.accent_color,
        p.name,
        w.added_date
      ORDER BY w.added_date DESC
      `,
      [userId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("GET /wishlist/:userId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/wishlist/:userId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const gameId = parseInt(req.body.gameId, 10);

    if (Number.isNaN(userId) || Number.isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid user id or game id" });
    }

    const userExists = await pool.query(
      "SELECT 1 FROM user_account WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (userExists.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const gameExists = await pool.query(
      "SELECT 1 FROM game WHERE game_id = $1 LIMIT 1",
      [gameId]
    );

    if (gameExists.rowCount === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const inserted = await pool.query(
      `
      INSERT INTO wishlist (user_id, game_id, added_date)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, game_id) DO NOTHING
      RETURNING user_id, game_id, added_date
      `,
      [userId, gameId]
    );

    return res.status(201).json({
      ok: true,
      message:
        inserted.rowCount === 0
          ? "Game already in wishlist"
          : "Game added to wishlist"
    });
  } catch (err) {
    console.error("POST /wishlist/:userId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/wishlist/:userId/:gameId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const gameId = parseInt(req.params.gameId, 10);

    if (Number.isNaN(userId) || Number.isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid user id or game id" });
    }

    const deleted = await pool.query(
      `
      DELETE FROM wishlist
      WHERE user_id = $1 AND game_id = $2
      RETURNING user_id, game_id
      `,
      [userId, gameId]
    );

    if (deleted.rowCount === 0) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    return res.json({ ok: true, message: "Game removed from wishlist" });
  } catch (err) {
    console.error("DELETE /wishlist/:userId/:gameId error:", err);
    return res.status(500).json({ error: err.message });
  }
});
/* =========================
   PROFILE
   ========================= */

app.get("/profile/:id", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const result = await pool.query(
      `
      SELECT
        user_id AS id,
        username AS name,
        email,
        join_date,
        COALESCE(avatar_style, 'adventurer') AS avatar_style,
        COALESCE(avatar_seed, username) AS avatar_seed,
        COALESCE(bio, '') AS bio
      FROM user_account
      WHERE user_id = $1
      LIMIT 1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("GET /profile/:id error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.put("/profile/:userId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { username, bio, avatar_style, avatar_seed } = req.body;

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const cleanUsername = String(username || "").trim();
    const cleanBio = String(bio || "");
    const cleanAvatarStyle = String(avatar_style || "adventurer").trim() || "adventurer";
    const cleanAvatarSeed = String(avatar_seed || cleanUsername).trim() || cleanUsername;

    if (!cleanUsername) {
      return res.status(400).json({ error: "Username is required" });
    }

    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters" });
    }

    if (cleanBio.length > 300) {
      return res.status(400).json({ error: "Bio must be at most 300 characters" });
    }

    const updated = await pool.query(
      `
      UPDATE user_account
      SET
        username = $1,
        bio = $2,
        avatar_style = $3,
        avatar_seed = $4
      WHERE user_id = $5
      RETURNING
        user_id AS id,
        username AS name,
        email,
        join_date,
        COALESCE(avatar_style, 'adventurer') AS avatar_style,
        COALESCE(avatar_seed, username) AS avatar_seed,
        COALESCE(bio, '') AS bio
      `,
      [cleanUsername, cleanBio, cleanAvatarStyle, cleanAvatarSeed, userId]
    );

    if (updated.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      ok: true,
      user: updated.rows[0],
    });
  } catch (err) {
    console.error("PUT /profile/:userId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.put("/profile/:userId/password", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { currentPassword, newPassword } = req.body;

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const found = await pool.query(
      `
      SELECT user_id, password_hash
      FROM user_account
      WHERE user_id = $1
      LIMIT 1
      `,
      [userId]
    );

    if (found.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = found.rows[0];
    const ok = await bcrypt.compare(currentPassword, user.password_hash || "");

    if (!ok) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const nextHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE user_account
      SET password_hash = $1
      WHERE user_id = $2
      `,
      [nextHash, userId]
    );

    return res.json({
      ok: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("PUT /profile/:userId/password error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   SHOP
   ========================= */

app.get("/shop", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        gsl.listing_id,
        gsl.price,
        gsl.currency,
        gsl.purchase_url,
        gsl.stock_status,
        g.game_id,
        g.title,
        g.subtitle,
        g.avg_score AS score,
        g.release_year AS year,
        g.cover_url AS cover,
        g.accent_color AS accent,
        p.name AS publisher,
        s.store_id,
        s.name AS store_name,
        s.store_type,
        COALESCE(
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT platform.platform_name), NULL),
          '{}'
        ) AS platforms
      FROM game_store_listing gsl
      JOIN game g ON gsl.game_id = g.game_id
      LEFT JOIN publisher p ON g.publisher_id = p.publisher_id
      LEFT JOIN store s ON gsl.store_id = s.store_id
      LEFT JOIN game_platform gp ON g.game_id = gp.game_id
      LEFT JOIN platform ON gp.platform_id = platform.platform_id
      GROUP BY
        gsl.listing_id,
        gsl.price,
        gsl.currency,
        gsl.purchase_url,
        gsl.stock_status,
        g.game_id,
        g.title,
        g.subtitle,
        g.avg_score,
        g.release_year,
        g.cover_url,
        g.accent_color,
        p.name,
        s.store_id,
        s.name,
        s.store_type
      ORDER BY g.avg_score DESC NULLS LAST, g.title ASC
    `);

    return res.json(result.rows);
  } catch (err) {
    console.error("GET /shop error:", err);
    return res.status(500).json({ error: err.message });
  }
});



/* =========================
   CART
   ========================= */

app.get("/cart/:userId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const userExists = await pool.query(
      "SELECT 1 FROM user_account WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (userExists.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await pool.query(
      `
      SELECT
        ci.listing_id,
        ci.quantity,
        gsl.price,
        gsl.currency,
        gsl.stock_status,
        gsl.purchase_url,
        g.game_id,
        g.title,
        g.subtitle,
        g.release_year AS year,
        g.cover_url AS cover,
        g.accent_color AS accent,
        s.name AS store_name,
        (ci.quantity * gsl.price) AS subtotal
      FROM cart c
      JOIN cart_item ci ON c.cart_id = ci.cart_id
      JOIN game_store_listing gsl ON ci.listing_id = gsl.listing_id
      JOIN game g ON gsl.game_id = g.game_id
      LEFT JOIN store s ON gsl.store_id = s.store_id
      WHERE c.user_id = $1
      ORDER BY c.cart_id DESC, ci.listing_id ASC
      `,
      [userId]
    );

    const items = result.rows.map((row) => ({
      ...row,
      price: Number(row.price || 0),
      subtotal: Number(row.subtotal || 0),
      quantity: Number(row.quantity || 0),
    }));

    const total = items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
    const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    return res.json({
      items,
      total,
      itemCount,
      uniqueCount: items.length,
    });
  } catch (err) {
    console.error("GET /cart/:userId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/cart/:userId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const listingId = parseInt(req.body.listingId, 10);
    const quantity = parseInt(req.body.quantity || 1, 10);

    if (Number.isNaN(userId) || Number.isNaN(listingId) || Number.isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ error: "Invalid user id, listing id, or quantity" });
    }

    const userExists = await pool.query(
      "SELECT 1 FROM user_account WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (userExists.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const listingExists = await pool.query(
      "SELECT 1 FROM game_store_listing WHERE listing_id = $1 LIMIT 1",
      [listingId]
    );

    if (listingExists.rowCount === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const cartId = await getOrCreateCart(userId);

    await pool.query(
      `
      INSERT INTO cart_item (cart_id, listing_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (cart_id, listing_id)
      DO UPDATE SET quantity = cart_item.quantity + EXCLUDED.quantity
      `,
      [cartId, listingId, quantity]
    );

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("POST /cart/:userId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.patch("/cart/:userId/:listingId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const listingId = parseInt(req.params.listingId, 10);
    const quantity = parseInt(req.body.quantity, 10);

    if (Number.isNaN(userId) || Number.isNaN(listingId) || Number.isNaN(quantity)) {
      return res.status(400).json({ error: "Invalid user id, listing id, or quantity" });
    }

    const cartResult = await pool.query(
      "SELECT cart_id FROM cart WHERE user_id = $1 ORDER BY cart_id ASC LIMIT 1",
      [userId]
    );

    if (cartResult.rowCount === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartId = cartResult.rows[0].cart_id;

    if (quantity <= 0) {
      await pool.query(
        "DELETE FROM cart_item WHERE cart_id = $1 AND listing_id = $2",
        [cartId, listingId]
      );

      return res.json({ ok: true });
    }

    const updated = await pool.query(
      `
      UPDATE cart_item
      SET quantity = $3
      WHERE cart_id = $1 AND listing_id = $2
      `,
      [cartId, listingId, quantity]
    );

    if (updated.rowCount === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /cart/:userId/:listingId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/cart/:userId/:listingId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const listingId = parseInt(req.params.listingId, 10);

    if (Number.isNaN(userId) || Number.isNaN(listingId)) {
      return res.status(400).json({ error: "Invalid user id or listing id" });
    }

    const cartResult = await pool.query(
      "SELECT cart_id FROM cart WHERE user_id = $1 ORDER BY cart_id ASC LIMIT 1",
      [userId]
    );

    if (cartResult.rowCount === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await pool.query(
      "DELETE FROM cart_item WHERE cart_id = $1 AND listing_id = $2",
      [cartResult.rows[0].cart_id, listingId]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /cart/:userId/:listingId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   CHECKOUT / ORDERS
   ========================= */

async function buildSingleOrder(orderId, userId) {
  const orderResult = await pool.query(
    `
    SELECT
      o.order_id,
      o.user_id,
      o.total_amount,
      o.total_items,
      o.currency,
      o.payment_method,
      o.customer_name,
      o.customer_email,
      o.billing_address,
      o.order_status,
      o.created_at
    FROM customer_order o
    WHERE o.order_id = $1 AND o.user_id = $2
    LIMIT 1
    `,
    [orderId, userId]
  );

  if (orderResult.rowCount === 0) {
    return null;
  }

  const itemsResult = await pool.query(
    `
    SELECT
      oi.order_item_id,
      oi.order_id,
      oi.listing_id,
      oi.game_id,
      oi.quantity,
      oi.unit_price,
      oi.subtotal,
      g.title,
      g.cover_url AS cover,
      s.name AS store_name
    FROM order_item oi
    JOIN game g ON oi.game_id = g.game_id
    LEFT JOIN game_store_listing gsl ON oi.listing_id = gsl.listing_id
    LEFT JOIN store s ON gsl.store_id = s.store_id
    WHERE oi.order_id = $1
    ORDER BY oi.order_item_id ASC
    `,
    [orderId]
  );

  return {
    ...orderResult.rows[0],
    total_amount: Number(orderResult.rows[0].total_amount || 0),
    total_items: Number(orderResult.rows[0].total_items || 0),
    items: itemsResult.rows.map((row) => ({
      ...row,
      quantity: Number(row.quantity || 0),
      unit_price: Number(row.unit_price || 0),
      subtotal: Number(row.subtotal || 0),
    })),
  };
}

app.post("/checkout/:userId", requireAuth, requireSameUser, async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = parseInt(req.params.userId, 10);
    const {
      customerName,
      customerEmail,
      billingAddress,
      paymentMethod,
    } = req.body || {};

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    if (!customerName || !customerEmail || !billingAddress || !paymentMethod) {
      return res.status(400).json({
        error:
          "customerName, customerEmail, billingAddress, and paymentMethod are required",
      });
    }

    await client.query("BEGIN");

    const userExists = await client.query(
      "SELECT 1 FROM user_account WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (userExists.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User not found" });
    }

    const cartItemsResult = await client.query(
      `
      SELECT
        c.cart_id,
        ci.listing_id,
        ci.quantity,
        gsl.price,
        gsl.currency,
        g.game_id
      FROM cart c
      JOIN cart_item ci ON c.cart_id = ci.cart_id
      JOIN game_store_listing gsl ON ci.listing_id = gsl.listing_id
      JOIN game g ON gsl.game_id = g.game_id
      WHERE c.user_id = $1
      ORDER BY ci.listing_id ASC
      `,
      [userId]
    );

    const cartItems = cartItemsResult.rows.map((row) => ({
      ...row,
      quantity: Number(row.quantity || 0),
      price: Number(row.price || 0),
    }));

    if (cartItems.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const totalItems = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const currency = cartItems[0].currency || "USD";

    const orderInsert = await client.query(
      `
      INSERT INTO customer_order (
        user_id,
        total_amount,
        total_items,
        currency,
        payment_method,
        customer_name,
        customer_email,
        billing_address,
        order_status,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'confirmed', NOW())
      RETURNING order_id
      `,
      [
        userId,
        totalAmount,
        totalItems,
        currency,
        paymentMethod,
        customerName,
        customerEmail,
        billingAddress,
      ]
    );

    const orderId = orderInsert.rows[0].order_id;

    for (const item of cartItems) {
      const subtotal = item.quantity * item.price;

      await client.query(
        `
        INSERT INTO order_item (
          order_id,
          listing_id,
          game_id,
          quantity,
          unit_price,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          orderId,
          item.listing_id,
          item.game_id,
          item.quantity,
          item.price,
          subtotal,
        ]
      );
    }

    await client.query(
      `
      DELETE FROM cart_item
      WHERE cart_id IN (
        SELECT cart_id
        FROM cart
        WHERE user_id = $1
      )
      `,
      [userId]
    );

    await client.query("COMMIT");

    const order = await buildSingleOrder(orderId, userId);

    return res.status(201).json({
      ok: true,
      order,
    });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (_) {}

    console.error("POST /checkout/:userId error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.get("/orders/:userId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const userExists = await pool.query(
      "SELECT 1 FROM user_account WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (userExists.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const ordersResult = await pool.query(
      `
      SELECT
        o.order_id,
        o.user_id,
        o.total_amount,
        o.total_items,
        o.currency,
        o.payment_method,
        o.customer_name,
        o.customer_email,
        o.billing_address,
        o.order_status,
        o.created_at
      FROM customer_order o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC, o.order_id DESC
      `,
      [userId]
    );

    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `
        SELECT
          oi.order_item_id,
          oi.order_id,
          oi.listing_id,
          oi.game_id,
          oi.quantity,
          oi.unit_price,
          oi.subtotal,
          g.title,
          g.cover_url AS cover,
          s.name AS store_name
        FROM order_item oi
        JOIN game g ON oi.game_id = g.game_id
        LEFT JOIN game_store_listing gsl ON oi.listing_id = gsl.listing_id
        LEFT JOIN store s ON gsl.store_id = s.store_id
        WHERE oi.order_id = $1
        ORDER BY oi.order_item_id ASC
        `,
        [order.order_id]
      );

      orders.push({
        ...order,
        total_amount: Number(order.total_amount || 0),
        total_items: Number(order.total_items || 0),
        items: itemsResult.rows.map((row) => ({
          ...row,
          quantity: Number(row.quantity || 0),
          unit_price: Number(row.unit_price || 0),
          subtotal: Number(row.subtotal || 0),
        })),
      });
    }

    return res.json(orders);
  } catch (err) {
    console.error("GET /orders/:userId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/orders/:userId/:orderId", requireAuth, requireSameUser, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const orderId = parseInt(req.params.orderId, 10);

    if (Number.isNaN(userId) || Number.isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid user id or order id" });
    }

    const order = await buildSingleOrder(orderId, userId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(order);
  } catch (err) {
    console.error("GET /orders/:userId/:orderId error:", err);
    return res.status(500).json({ error: err.message });
  }
});
module.exports = app;