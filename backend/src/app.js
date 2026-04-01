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

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-change-this";
const JWT_EXPIRES_IN = "7d";
const USER_ROLE = "user";
const ADMIN_ROLE = "admin";

function normalizeRole(role) {
  return String(role || USER_ROLE).trim().toLowerCase() === ADMIN_ROLE
    ? ADMIN_ROLE
    : USER_ROLE;
}

function isAdminFromRole(role) {
  return normalizeRole(role) === ADMIN_ROLE;
}

async function ensureUserAccountAdminRoleColumn() {
  await pool.query(`
    ALTER TABLE user_account
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'
  `);

  await pool.query(
    `
    UPDATE user_account
    SET role = $1
    WHERE role IS NULL OR TRIM(role) = ''
    `,
    [USER_ROLE]
  );

  const adminEmailList = String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmailList.length > 0) {
    await pool.query(
      `
      UPDATE user_account
      SET role = $1
      WHERE LOWER(email) = ANY($2::text[])
      `,
      [ADMIN_ROLE, adminEmailList]
    );
  }
}

const adminRoleReady = ensureUserAccountAdminRoleColumn().catch((err) => {
  console.error("Failed to ensure admin role column:", err);
});

app.use(async (req, res, next) => {
  try {
    await adminRoleReady;
    next();
  } catch (err) {
    next(err);
  }
});

function signToken(user) {
  const role = normalizeRole(user.role);

  return jwt.sign(
    {
      id: user.user_id ?? user.id,
      email: user.email,
      role,
      is_admin: isAdminFromRole(role),
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

function getOptionalAuthUser(req) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return null;
    }

    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
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

function requireAdmin(req, res, next) {
  const role = normalizeRole(req.authUser?.role);
  const isAdmin = Boolean(req.authUser?.is_admin) || isAdminFromRole(role);

  if (!isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
}

/* Allow frontend to call backend */
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

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

function buildDicebearAvatar(style, seed) {
  const avatarStyle = style || "adventurer";
  const avatarSeed = seed || "Player";
  return `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${encodeURIComponent(
    avatarSeed
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

function normalizePurchaseUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const blockedHosts = new Set([
    "example.com",
    "www.example.com",
    "example.org",
    "www.example.org",
    "example.net",
    "www.example.net",
  ]);

  function isBlockedPlaceholderUrl(urlValue) {
    try {
      const parsed = new URL(urlValue);
      const host = String(parsed.hostname || "").toLowerCase();

      if (!host) return true;
      if (blockedHosts.has(host)) return true;
      if (host.endsWith(".example.com")) return true;
      if (host.endsWith(".example.org")) return true;
      if (host.endsWith(".example.net")) return true;

      return false;
    } catch {
      return true;
    }
  }

  if (/^https?:\/\//i.test(raw)) {
    return isBlockedPlaceholderUrl(raw) ? "" : raw;
  }

  if (/^[\w.-]+(?:\:[0-9]+)?(?:\/.*)?$/i.test(raw)) {
    const normalized = `https://${raw}`;
    return isBlockedPlaceholderUrl(normalized) ? "" : normalized;
  }

  return "";
}

function buildStoreFallbackUrl({ storeName, storeType, title }) {
  const normalizedStoreName = String(storeName || "").toLowerCase();
  const normalizedStoreType = String(storeType || "").toLowerCase();
  const gameTitle = String(title || "").trim();

  if (!gameTitle) return "";

  const encodedTitle = encodeURIComponent(gameTitle);

  if (
    normalizedStoreName.includes("steam") ||
    normalizedStoreType.includes("steam")
  ) {
    return `https://store.steampowered.com/search/?term=${encodedTitle}`;
  }

  if (
    normalizedStoreName.includes("epic") ||
    normalizedStoreType.includes("epic")
  ) {
    return `https://store.epicgames.com/en-US/browse?q=${encodedTitle}&sortBy=relevancy&sortDir=DESC&count=40`;
  }

  return "";
}

function resolveStorePurchaseUrl(row) {
  return (
    normalizePurchaseUrl(row.purchase_url) ||
    buildStoreFallbackUrl({
      storeName: row.store_name,
      storeType: row.store_type,
      title: row.title,
    })
  );
}

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

async function getCartItemsForCheckout(userId) {
  const result = await pool.query(
    `
    SELECT
      c.cart_id,
      ci.listing_id,
      ci.quantity,
      gsl.price,
      gsl.currency,
      g.game_id,
      g.title,
      g.cover_url AS cover,
      s.name AS store_name,
      (ci.quantity * gsl.price) AS subtotal
    FROM cart c
    JOIN cart_item ci ON c.cart_id = ci.cart_id
    JOIN game_store_listing gsl ON ci.listing_id = gsl.listing_id
    JOIN game g ON gsl.game_id = g.game_id
    LEFT JOIN store s ON gsl.store_id = s.store_id
    WHERE c.user_id = $1
    ORDER BY ci.listing_id ASC
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    ...row,
    price: Number(row.price || 0),
    subtotal: Number(row.subtotal || 0),
    quantity: Number(row.quantity || 0),
  }));
}

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

  if (orderResult.rows.length === 0) {
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

function serializeReviewRow(row) {
  return {
    id: row.id,
    userId: row.userId,
    user: row.user,
    avatar_style: row.avatar_style,
    avatar_seed: row.avatar_seed,
    avatar: buildDicebearAvatar(row.avatar_style, row.avatar_seed || row.user),
    gameId: row.gameId,
    text: row.text,
    score: Number(row.score || 0),
    date: row.date,
    updatedAt: row.updatedAt,
    loveCount: Number(row.loveCount || 0),
    lovedByMe: Boolean(row.lovedByMe),
  };
}

/* Get all reviews for one game */
app.get("/games/:id/reviews", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const authUser = getOptionalAuthUser(req);
    const currentUserId = Number(authUser?.id || null);

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
        COALESCE(ua.avatar_style, 'adventurer') AS avatar_style,
        COALESCE(ua.avatar_seed, ua.username) AS avatar_seed,
        ur.game_id AS "gameId",
        ur.review_text AS text,
        ur.score,
        ur.review_date AS date,
        ur.updated_at AS "updatedAt",
        COALESCE(l.love_count, 0) AS "loveCount",
        COALESCE(my_like.loved_by_me, false) AS "lovedByMe"
      FROM user_review ur
      JOIN user_account ua ON ur.user_id = ua.user_id
      LEFT JOIN (
        SELECT user_review_id, COUNT(*)::int AS love_count
        FROM user_review_like
        GROUP BY user_review_id
      ) l ON l.user_review_id = ur.user_review_id
      LEFT JOIN (
        SELECT user_review_id, true AS loved_by_me
        FROM user_review_like
        WHERE user_id = $2
      ) my_like ON my_like.user_review_id = ur.user_review_id
      WHERE ur.game_id = $1
      ORDER BY ur.review_date DESC
      `,
      [gameId, currentUserId || null]
    );

    const reviews = result.rows.map(serializeReviewRow);

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
      return res
        .status(400)
        .json({ error: "Review text must be at least 10 characters" });
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
      INSERT INTO user_review (user_id, game_id, review_text, score, review_date, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
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

app.put("/reviews/:reviewId", requireAuth, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);
    const userId = Number(req.authUser?.id);
    const score = parseFloat(req.body.score);
    const reviewText = String(req.body.reviewText || "").trim();

    if (Number.isNaN(reviewId) || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid review id or user id" });
    }

    if (Number.isNaN(score) || score < 0 || score > 10) {
      return res.status(400).json({ error: "Score must be between 0 and 10" });
    }

    if (reviewText.length < 10) {
      return res
        .status(400)
        .json({ error: "Review text must be at least 10 characters" });
    }

    const existingReview = await pool.query(
      `
      SELECT user_review_id, user_id, game_id
      FROM user_review
      WHERE user_review_id = $1
      LIMIT 1
      `,
      [reviewId]
    );

    if (existingReview.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (Number(existingReview.rows[0].user_id) !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await pool.query(
      `
      UPDATE user_review
      SET review_text = $1,
          score = $2,
          updated_at = NOW()
      WHERE user_review_id = $3
      `,
      [reviewText, score, reviewId]
    );

    await updateGameAverageScore(existingReview.rows[0].game_id);

    return res.json({ ok: true, id: reviewId, gameId: existingReview.rows[0].game_id });
  } catch (err) {
    console.error("PUT /reviews/:reviewId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/reviews/:reviewId", requireAuth, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);
    const userId = Number(req.authUser?.id);

    if (Number.isNaN(reviewId) || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid review id or user id" });
    }

    const existingReview = await pool.query(
      `
      SELECT user_review_id, user_id, game_id
      FROM user_review
      WHERE user_review_id = $1
      LIMIT 1
      `,
      [reviewId]
    );

    if (existingReview.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (Number(existingReview.rows[0].user_id) !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await pool.query("DELETE FROM user_review WHERE user_review_id = $1", [reviewId]);
    await updateGameAverageScore(existingReview.rows[0].game_id);

    return res.json({ ok: true, gameId: existingReview.rows[0].game_id });
  } catch (err) {
    console.error("DELETE /reviews/:reviewId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/reviews/:reviewId/love", requireAuth, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);
    const userId = Number(req.authUser?.id);

    if (Number.isNaN(reviewId) || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid review id or user id" });
    }

    const reviewExists = await pool.query(
      "SELECT 1 FROM user_review WHERE user_review_id = $1 LIMIT 1",
      [reviewId]
    );

    if (reviewExists.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    const existingLove = await pool.query(
      `
      SELECT 1
      FROM user_review_like
      WHERE user_id = $1 AND user_review_id = $2
      LIMIT 1
      `,
      [userId, reviewId]
    );

    let loved = false;

    if (existingLove.rowCount > 0) {
      await pool.query(
        `
        DELETE FROM user_review_like
        WHERE user_id = $1 AND user_review_id = $2
        `,
        [userId, reviewId]
      );
    } else {
      loved = true;
      await pool.query(
        `
        INSERT INTO user_review_like (user_id, user_review_id)
        VALUES ($1, $2)
        `,
        [userId, reviewId]
      );
    }

    const countResult = await pool.query(
      `
      SELECT COUNT(*)::int AS love_count
      FROM user_review_like
      WHERE user_review_id = $1
      `,
      [reviewId]
    );

    return res.json({
      ok: true,
      loved,
      loveCount: Number(countResult.rows[0]?.love_count || 0),
    });
  } catch (err) {
    console.error("POST /reviews/:reviewId/love error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   COMMENT THREADS
   ========================= */

function serializeCommentRow(row) {
  return {
    id: row.id,
    userId: row.userId,
    user: row.user,
    avatar_style: row.avatar_style,
    avatar_seed: row.avatar_seed,
    avatar: buildDicebearAvatar(row.avatar_style, row.avatar_seed || row.user),
    userReviewId: row.userReviewId,
    parentCommentId: row.parentCommentId,
    text: row.text,
    date: row.date,
    updatedAt: row.updatedAt,
    loveCount: Number(row.loveCount || 0),
    lovedByMe: Boolean(row.lovedByMe),
  };
}

app.get("/games/:id/comments", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const authUser = getOptionalAuthUser(req);
    const currentUserId = Number(authUser?.id || null);

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
        c.comment_id AS id,
        c.user_id AS "userId",
        ua.username AS user,
        COALESCE(ua.avatar_style, 'adventurer') AS avatar_style,
        COALESCE(ua.avatar_seed, ua.username) AS avatar_seed,
        c.user_review_id AS "userReviewId",
        c.parent_comment_id AS "parentCommentId",
        c.content AS text,
        c.comment_date AS date,
        c.updated_at AS "updatedAt",
        COALESCE(l.love_count, 0) AS "loveCount",
        COALESCE(my_like.loved_by_me, false) AS "lovedByMe"
      FROM comment c
      JOIN user_review ur ON c.user_review_id = ur.user_review_id
      JOIN user_account ua ON c.user_id = ua.user_id
      LEFT JOIN (
        SELECT comment_id, COUNT(*)::int AS love_count
        FROM comment_like
        GROUP BY comment_id
      ) l ON l.comment_id = c.comment_id
      LEFT JOIN (
        SELECT comment_id, true AS loved_by_me
        FROM comment_like
        WHERE user_id = $2
      ) my_like ON my_like.comment_id = c.comment_id
      WHERE ur.game_id = $1
      ORDER BY ur.user_review_id DESC, c.comment_date ASC, c.comment_id ASC
      `,
      [gameId, currentUserId || null]
    );

    return res.json(result.rows.map(serializeCommentRow));
  } catch (err) {
    console.error("GET /games/:id/comments error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/reviews/:reviewId/comments", requireAuth, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);
    const userId = Number(req.authUser?.id);
    const content = String(req.body.content || "").trim();

    if (Number.isNaN(reviewId) || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid review id or user id" });
    }

    if (content.length < 3) {
      return res.status(400).json({ error: "Comment must be at least 3 characters" });
    }

    const reviewResult = await pool.query(
      `
      SELECT user_review_id
      FROM user_review
      WHERE user_review_id = $1
      LIMIT 1
      `,
      [reviewId]
    );

    if (reviewResult.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    const created = await pool.query(
      `
      INSERT INTO comment (user_id, user_review_id, parent_comment_id, content, comment_date, updated_at)
      VALUES ($1, $2, NULL, $3, NOW(), NOW())
      RETURNING comment_id AS id
      `,
      [userId, reviewId, content]
    );

    return res.status(201).json({ ok: true, id: created.rows[0].id });
  } catch (err) {
    console.error("POST /reviews/:reviewId/comments error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/comments/:commentId/replies", requireAuth, async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = Number(req.authUser?.id);
    const content = String(req.body.content || "").trim();

    if (Number.isNaN(commentId) || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid comment id or user id" });
    }

    if (content.length < 3) {
      return res.status(400).json({ error: "Comment must be at least 3 characters" });
    }

    const parentResult = await pool.query(
      `
      SELECT c.comment_id, c.user_review_id, c.parent_comment_id
      FROM comment c
      WHERE c.comment_id = $1
      LIMIT 1
      `,
      [commentId]
    );

    if (parentResult.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const parentComment = parentResult.rows[0];

    if (parentComment.parent_comment_id) {
      return res.status(400).json({ error: "Replies are limited to one level" });
    }

    const created = await pool.query(
      `
      INSERT INTO comment (user_id, user_review_id, parent_comment_id, content, comment_date, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING comment_id AS id
      `,
      [userId, parentComment.user_review_id, commentId, content]
    );

    return res.status(201).json({ ok: true, id: created.rows[0].id });
  } catch (err) {
    console.error("POST /comments/:commentId/replies error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.put("/comments/:commentId", requireAuth, async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = Number(req.authUser?.id);
    const content = String(req.body.content || "").trim();

    if (Number.isNaN(commentId) || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid comment id or user id" });
    }

    if (content.length < 3) {
      return res.status(400).json({ error: "Comment must be at least 3 characters" });
    }

    const existing = await pool.query(
      `
      SELECT comment_id, user_id
      FROM comment
      WHERE comment_id = $1
      LIMIT 1
      `,
      [commentId]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (Number(existing.rows[0].user_id) !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await pool.query(
      `
      UPDATE comment
      SET content = $1,
          updated_at = NOW()
      WHERE comment_id = $2
      RETURNING comment_id AS id
      `,
      [content, commentId]
    );

    return res.json({ ok: true, id: updated.rows[0].id });
  } catch (err) {
    console.error("PUT /comments/:commentId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/comments/:commentId", requireAuth, async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = Number(req.authUser?.id);

    if (Number.isNaN(commentId) || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid comment id or user id" });
    }

    const existing = await pool.query(
      `
      SELECT comment_id, user_id
      FROM comment
      WHERE comment_id = $1
      LIMIT 1
      `,
      [commentId]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (Number(existing.rows[0].user_id) !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await pool.query("DELETE FROM comment WHERE comment_id = $1", [commentId]);

    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /comments/:commentId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/comments/:commentId/love", requireAuth, async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = Number(req.authUser?.id);

    if (Number.isNaN(commentId) || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid comment id or user id" });
    }

    const commentExists = await pool.query(
      "SELECT 1 FROM comment WHERE comment_id = $1 LIMIT 1",
      [commentId]
    );

    if (commentExists.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const existingLove = await pool.query(
      `
      SELECT 1
      FROM comment_like
      WHERE user_id = $1 AND comment_id = $2
      LIMIT 1
      `,
      [userId, commentId]
    );

    let loved = false;

    if (existingLove.rowCount > 0) {
      await pool.query(
        `
        DELETE FROM comment_like
        WHERE user_id = $1 AND comment_id = $2
        `,
        [userId, commentId]
      );
    } else {
      loved = true;
      await pool.query(
        `
        INSERT INTO comment_like (user_id, comment_id, created_at)
        VALUES ($1, $2, NOW())
        `,
        [userId, commentId]
      );
    }

    const loveCountResult = await pool.query(
      `
      SELECT COUNT(*)::int AS love_count
      FROM comment_like
      WHERE comment_id = $1
      `,
      [commentId]
    );

    return res.json({
      ok: true,
      loved,
      loveCount: Number(loveCountResult.rows[0]?.love_count || 0),
    });
  } catch (err) {
    console.error("POST /comments/:commentId/love error:", err);
    return res.status(500).json({ error: err.message });
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
      return res
        .status(400)
        .json({ error: "username, email, password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
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
      `
      INSERT INTO user_account
        (username, email, password_hash, join_date, avatar_style, avatar_seed, bio, role)
      VALUES
        ($1, $2, $3, NOW(), $4, $5, '', $6)
      RETURNING user_id, username, email, join_date, avatar_style, avatar_seed, bio, role
      `,
      [username, email, passwordHash, avatarStyle, avatarSeed, USER_ROLE]
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
        role: normalizeRole(u.role),
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
      `SELECT user_id, username, email, password_hash, join_date,
              COALESCE(avatar_style, 'adventurer') AS avatar_style,
              COALESCE(avatar_seed, username) AS avatar_seed,
              COALESCE(bio, '') AS bio,
              COALESCE(role, 'user') AS role
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

    console.log("DEBUG LOGIN:", { user_id: user.user_id, email: user.email, raw_role: user.role, normalized_role: normalizeRole(user.role) });

    const token = signToken(user);

    return res.json({
      user: {
        id: user.user_id,
        name: user.username,
        email: user.email,
        join_date: user.join_date,
        avatar_style: user.avatar_style,
        avatar_seed: user.avatar_seed,
        bio: user.bio,
        role: normalizeRole(user.role),
      },
      token,
    });
  } catch (err) {
    console.error("POST /auth/login error:", err);
    return res.status(500).json({ error: err.message });
  }
});

async function updateGameAverageScore(gameId) {
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
}

app.get("/admin/overview", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [stats, games, reviews] = await Promise.all([
      pool.query(
        `
        SELECT
          (SELECT COUNT(*)::int FROM game) AS "gameCount",
          (SELECT COUNT(*)::int FROM user_review) AS "reviewCount",
          (SELECT COUNT(*)::int FROM user_account WHERE COALESCE(role, 'user') = 'admin') AS "adminCount"
        `
      ),
      pool.query(
        `
        SELECT
          g.game_id AS id,
          g.title,
          g.release_year AS year,
          g.avg_score AS score,
          g.cover_url AS cover,
          COALESCE(p.name, 'Unknown') AS publisher,
          COUNT(ur.user_review_id)::int AS "reviewCount"
        FROM game g
        LEFT JOIN publisher p ON g.publisher_id = p.publisher_id
        LEFT JOIN user_review ur ON ur.game_id = g.game_id
        GROUP BY g.game_id, p.name
        ORDER BY g.game_id DESC
        LIMIT 200
        `
      ),
      pool.query(
        `
        SELECT
          ur.user_review_id AS id,
          ur.game_id AS "gameId",
          ur.user_id AS "userId",
          ur.score,
          ur.review_text AS text,
          ur.review_date AS date,
          g.title AS "gameTitle",
          ua.username AS "userName"
        FROM user_review ur
        JOIN game g ON g.game_id = ur.game_id
        JOIN user_account ua ON ua.user_id = ur.user_id
        ORDER BY ur.review_date DESC
        LIMIT 200
        `
      ),
    ]);

    return res.json({
      stats: stats.rows[0],
      games: games.rows,
      reviews: reviews.rows,
    });
  } catch (err) {
    console.error("GET /admin/overview error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/admin/games", requireAuth, requireAdmin, async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      title,
      subtitle,
      description,
      releaseYear,
      cover,
      accent,
      publisherName,
      genres,
      platforms,
      storeName,
      price,
      currency,
      stockStatus,
    } = req.body || {};

    const safeTitle = String(title || "").trim();
    const safeSubtitle = String(subtitle || "").trim();
    const safeDescription = String(description || "").trim();
    const safeCover = String(cover || "").trim();
    const safeAccent = String(accent || "#ff2d55").trim() || "#ff2d55";
    const safePublisherName = String(publisherName || "Unknown").trim() || "Unknown";
    const safeStoreName = String(storeName || "Steam").trim() || "Steam";
    const safeCurrency = String(currency || "USD").trim() || "USD";
    const safeStockStatus = String(stockStatus || "in_stock").trim() || "in_stock";
    const safeYear = parseInt(releaseYear, 10);
    const safePrice = Number(price || 0);
    const safeGenres = Array.isArray(genres)
      ? genres.map((g) => String(g || "").trim()).filter(Boolean)
      : [];
    const safePlatforms = Array.isArray(platforms)
      ? platforms.map((p) => String(p || "").trim()).filter(Boolean)
      : [];

    if (!safeTitle) {
      return res.status(400).json({ error: "Game title is required" });
    }

    if (Number.isNaN(safeYear) || safeYear < 1970 || safeYear > 2100) {
      return res.status(400).json({ error: "Valid release year is required" });
    }

    if (!Number.isFinite(safePrice) || safePrice < 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    await client.query("BEGIN");

    const existingPublisher = await client.query(
      "SELECT publisher_id FROM publisher WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [safePublisherName]
    );

    let publisherId = existingPublisher.rows[0]?.publisher_id || null;

    if (!publisherId) {
      const publisherInsert = await client.query(
        `
        INSERT INTO publisher (name)
        VALUES ($1)
        RETURNING publisher_id
        `,
        [safePublisherName]
      );
      publisherId = publisherInsert.rows[0]?.publisher_id || null;
    }

    const gameInsert = await client.query(
      `
      INSERT INTO game (
        title,
        subtitle,
        description,
        release_year,
        cover_url,
        accent_color,
        avg_score,
        publisher_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, 0, $7)
      RETURNING game_id AS id
      `,
      [safeTitle, safeSubtitle || null, safeDescription || null, safeYear, safeCover || null, safeAccent, publisherId]
    );

    const gameId = gameInsert.rows[0].id;

    for (const genreName of safeGenres) {
      const existingGenre = await client.query(
        "SELECT genre_id FROM genre WHERE LOWER(genre_name) = LOWER($1) LIMIT 1",
        [genreName]
      );

      let genreId = existingGenre.rows[0]?.genre_id;
      if (!genreId) {
        const genreInsert = await client.query(
          `
          INSERT INTO genre (genre_name)
          VALUES ($1)
          RETURNING genre_id
          `,
          [genreName]
        );
        genreId = genreInsert.rows[0]?.genre_id;
      }

      if (genreId) {
        await client.query(
          `
          INSERT INTO game_genre (game_id, genre_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          `,
          [gameId, genreId]
        );
      }
    }

    for (const platformName of safePlatforms) {
      const existingPlatform = await client.query(
        "SELECT platform_id FROM platform WHERE LOWER(platform_name) = LOWER($1) LIMIT 1",
        [platformName]
      );

      let platformId = existingPlatform.rows[0]?.platform_id;
      if (!platformId) {
        const platformInsert = await client.query(
          `
          INSERT INTO platform (platform_name)
          VALUES ($1)
          RETURNING platform_id
          `,
          [platformName]
        );
        platformId = platformInsert.rows[0]?.platform_id;
      }

      if (platformId) {
        await client.query(
          `
          INSERT INTO game_platform (game_id, platform_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          `,
          [gameId, platformId]
        );
      }
    }

    const existingStore = await client.query(
      "SELECT store_id FROM store WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [safeStoreName]
    );

    let storeId = existingStore.rows[0]?.store_id;
    if (!storeId) {
      const storeInsert = await client.query(
        `
        INSERT INTO store (name, website, store_type)
        VALUES ($1, NULL, 'digital')
        RETURNING store_id
        `,
        [safeStoreName]
      );
      storeId = storeInsert.rows[0]?.store_id;
    }

    if (storeId) {
      await client.query(
        `
        INSERT INTO game_store_listing (
          game_id,
          store_id,
          price,
          currency,
          stock_status,
          purchase_url
        )
        VALUES ($1, $2, $3, $4, $5, NULL)
        ON CONFLICT (game_id, store_id)
        DO UPDATE SET
          price = EXCLUDED.price,
          currency = EXCLUDED.currency,
          stock_status = EXCLUDED.stock_status
        `,
        [gameId, storeId, safePrice, safeCurrency, safeStockStatus]
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ ok: true, id: gameId });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (_) {}

    console.error("POST /admin/games error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put("/admin/games/:gameId", requireAuth, requireAdmin, async (req, res) => {
  const client = await pool.connect();

  function normalizeNameList(value) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item || "").trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  }

  try {
    const gameId = parseInt(req.params.gameId, 10);

    if (Number.isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid game id" });
    }

    const {
      title,
      subtitle,
      description,
      releaseYear,
      cover,
      accent,
      publisherName,
      genres,
      platforms,
      storeName,
      price,
      currency,
      stockStatus,
    } = req.body || {};

    const safeTitle = String(title || "").trim();
    const safeSubtitle = String(subtitle || "").trim();
    const safeDescription = String(description || "").trim();
    const safeCover = String(cover || "").trim();
    const safeAccent = String(accent || "#ff2d55").trim() || "#ff2d55";
    const safePublisherName = String(publisherName || "Unknown").trim() || "Unknown";
    const safeStoreName = String(storeName || "Steam").trim() || "Steam";
    const safeCurrency = String(currency || "USD").trim() || "USD";
    const safeStockStatus = String(stockStatus || "in_stock").trim() || "in_stock";
    const safeYear = parseInt(releaseYear, 10);
    const safePrice = Number(price || 0);
    const safeGenres = normalizeNameList(genres);
    const safePlatforms = normalizeNameList(platforms);

    if (!safeTitle) {
      return res.status(400).json({ error: "Game title is required" });
    }

    if (Number.isNaN(safeYear) || safeYear < 1970 || safeYear > 2100) {
      return res.status(400).json({ error: "Valid release year is required" });
    }

    if (!Number.isFinite(safePrice) || safePrice < 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    await client.query("BEGIN");

    const existingGame = await client.query(
      "SELECT game_id FROM game WHERE game_id = $1 LIMIT 1",
      [gameId]
    );

    if (existingGame.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Game not found" });
    }

    const existingPublisher = await client.query(
      "SELECT publisher_id FROM publisher WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [safePublisherName]
    );

    let publisherId = existingPublisher.rows[0]?.publisher_id || null;

    if (!publisherId) {
      const publisherInsert = await client.query(
        `
        INSERT INTO publisher (name)
        VALUES ($1)
        RETURNING publisher_id
        `,
        [safePublisherName]
      );
      publisherId = publisherInsert.rows[0]?.publisher_id || null;
    }

    await client.query(
      `
      UPDATE game
      SET
        title = $2,
        subtitle = $3,
        description = $4,
        release_year = $5,
        cover_url = $6,
        accent_color = $7,
        publisher_id = $8
      WHERE game_id = $1
      `,
      [
        gameId,
        safeTitle,
        safeSubtitle || null,
        safeDescription || null,
        safeYear,
        safeCover || null,
        safeAccent,
        publisherId,
      ]
    );

    await client.query("DELETE FROM game_genre WHERE game_id = $1", [gameId]);
    for (const genreName of safeGenres) {
      const existingGenre = await client.query(
        "SELECT genre_id FROM genre WHERE LOWER(genre_name) = LOWER($1) LIMIT 1",
        [genreName]
      );

      let genreId = existingGenre.rows[0]?.genre_id;
      if (!genreId) {
        const genreInsert = await client.query(
          `
          INSERT INTO genre (genre_name)
          VALUES ($1)
          RETURNING genre_id
          `,
          [genreName]
        );
        genreId = genreInsert.rows[0]?.genre_id;
      }

      if (genreId) {
        await client.query(
          `
          INSERT INTO game_genre (game_id, genre_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          `,
          [gameId, genreId]
        );
      }
    }

    await client.query("DELETE FROM game_platform WHERE game_id = $1", [gameId]);
    for (const platformName of safePlatforms) {
      const existingPlatform = await client.query(
        "SELECT platform_id FROM platform WHERE LOWER(platform_name) = LOWER($1) LIMIT 1",
        [platformName]
      );

      let platformId = existingPlatform.rows[0]?.platform_id;
      if (!platformId) {
        const platformInsert = await client.query(
          `
          INSERT INTO platform (platform_name)
          VALUES ($1)
          RETURNING platform_id
          `,
          [platformName]
        );
        platformId = platformInsert.rows[0]?.platform_id;
      }

      if (platformId) {
        await client.query(
          `
          INSERT INTO game_platform (game_id, platform_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          `,
          [gameId, platformId]
        );
      }
    }

    const existingStore = await client.query(
      "SELECT store_id FROM store WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [safeStoreName]
    );

    let storeId = existingStore.rows[0]?.store_id;
    if (!storeId) {
      const storeInsert = await client.query(
        `
        INSERT INTO store (name, website, store_type)
        VALUES ($1, NULL, 'digital')
        RETURNING store_id
        `,
        [safeStoreName]
      );
      storeId = storeInsert.rows[0]?.store_id;
    }

    if (storeId) {
      const existingListing = await client.query(
        `
        SELECT listing_id
        FROM game_store_listing
        WHERE game_id = $1
        ORDER BY listing_id ASC
        LIMIT 1
        `,
        [gameId]
      );

      if (existingListing.rowCount > 0) {
        await client.query(
          `
          UPDATE game_store_listing
          SET
            store_id = $2,
            price = $3,
            currency = $4,
            stock_status = $5
          WHERE listing_id = $1
          `,
          [existingListing.rows[0].listing_id, storeId, safePrice, safeCurrency, safeStockStatus]
        );
      } else {
        await client.query(
          `
          INSERT INTO game_store_listing (
            game_id,
            store_id,
            price,
            currency,
            stock_status,
            purchase_url
          )
          VALUES ($1, $2, $3, $4, $5, NULL)
          ON CONFLICT (game_id, store_id)
          DO UPDATE SET
            price = EXCLUDED.price,
            currency = EXCLUDED.currency,
            stock_status = EXCLUDED.stock_status
          `,
          [gameId, storeId, safePrice, safeCurrency, safeStockStatus]
        );
      }
    }

    await client.query("COMMIT");
    return res.json({ ok: true, id: gameId });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (_) {}

    console.error("PUT /admin/games/:gameId error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete("/admin/games/:gameId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const gameId = parseInt(req.params.gameId, 10);

    if (Number.isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid game id" });
    }

    const deleted = await pool.query(
      `
      DELETE FROM game
      WHERE game_id = $1
      RETURNING game_id
      `,
      [gameId]
    );

    if (deleted.rowCount === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /admin/games/:gameId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/admin/reviews/:reviewId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);

    if (Number.isNaN(reviewId)) {
      return res.status(400).json({ error: "Invalid review id" });
    }

    const deleted = await pool.query(
      `
      DELETE FROM user_review
      WHERE user_review_id = $1
      RETURNING game_id
      `,
      [reviewId]
    );

    if (deleted.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    await updateGameAverageScore(deleted.rows[0].game_id);

    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /admin/reviews/:reviewId error:", err);
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
  try {
    const authUser = getOptionalAuthUser(req);
    const currentUserId = Number(authUser?.id || null);

    const result = await pool.query(`
      SELECT 
        ur.user_review_id AS id,
        ur.user_id,
        u.username AS user,
        COALESCE(u.avatar_style, 'adventurer') AS avatar_style,
        COALESCE(u.avatar_seed, u.username) AS avatar_seed,
        ur.game_id AS "gameId",
        g.title AS game,
        ur.review_text AS text,
        ur.score,
        ur.review_date AS date,
        g.accent_color AS accent,
        COALESCE(l.love_count, 0) AS "loveCount",
        COALESCE(my_like.loved_by_me, false) AS "lovedByMe"
      FROM user_review ur
      JOIN user_account u ON ur.user_id = u.user_id
      JOIN game g ON ur.game_id = g.game_id
      LEFT JOIN (
        SELECT user_review_id, COUNT(*)::int AS love_count
        FROM user_review_like
        GROUP BY user_review_id
      ) l ON l.user_review_id = ur.user_review_id
      LEFT JOIN (
        SELECT user_review_id, true AS loved_by_me
        FROM user_review_like
        WHERE user_id = $1
      ) my_like ON my_like.user_review_id = ur.user_review_id
      ORDER BY ur.review_date DESC
      LIMIT 5
    `,
    [currentUserId || null]);

    const reviewsWithAvatar = result.rows.map((r) => ({
      ...r,
      avatar: buildDicebearAvatar(r.avatar_style, r.avatar_seed || r.user),
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
        COALESCE(bio, '') AS bio,
        COALESCE(role, 'user') AS role
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

    const rows = result.rows.map((row) => ({
      ...row,
      purchase_url: resolveStorePurchaseUrl(row),
    }));

    return res.json(rows);
  } catch (err) {
    console.error("GET /shop error:", err);
    return res.status(500).json({ error: err.message });
  }
});

async function getOrCreateCart(userId) {
  const existing = await pool.query(
    "SELECT cart_id FROM cart WHERE user_id = $1 ORDER BY cart_id ASC LIMIT 1",
    [userId]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].cart_id;
  }

  const created = await pool.query(
    "INSERT INTO cart (user_id) VALUES ($1) RETURNING cart_id",
    [userId]
  );

  return created.rows[0].cart_id;
}

async function getCartItemsForCheckout(userId) {
  const result = await pool.query(
    `
    SELECT
      c.cart_id,
      ci.listing_id,
      ci.quantity,
      gsl.price,
      gsl.currency,
      g.game_id,
      g.title,
      g.cover_url AS cover,
      s.name AS store_name,
      (ci.quantity * gsl.price) AS subtotal
    FROM cart c
    JOIN cart_item ci ON c.cart_id = ci.cart_id
    JOIN game_store_listing gsl ON ci.listing_id = gsl.listing_id
    JOIN game g ON gsl.game_id = g.game_id
    LEFT JOIN store s ON gsl.store_id = s.store_id
    WHERE c.user_id = $1
    ORDER BY ci.listing_id ASC
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    ...row,
    price: Number(row.price || 0),
    subtotal: Number(row.subtotal || 0),
    quantity: Number(row.quantity || 0),
  }));
}

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

  if (orderResult.rows.length === 0) {
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

    if (
      Number.isNaN(userId) ||
      Number.isNaN(listingId) ||
      Number.isNaN(quantity) ||
      quantity < 1
    ) {
      return res
        .status(400)
        .json({ error: "Invalid user id, listing id, or quantity" });
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
      return res
        .status(400)
        .json({ error: "Invalid user id, listing id, or quantity" });
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
    const { customerName, customerEmail, billingAddress, paymentMethod } = req.body || {};

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

    const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
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
        [orderId, item.listing_id, item.game_id, item.quantity, item.price, subtotal]
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