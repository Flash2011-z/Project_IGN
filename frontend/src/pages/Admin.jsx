import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authHeader } from "../utils/auth";

const API_BASE = "http://localhost:4000";

const initialForm = {
  title: "",
  subtitle: "",
  description: "",
  releaseYear: "",
  publisherName: "",
  cover: "",
  accent: "#ff2d55",
  storeName: "Steam",
  price: "59.99",
  currency: "USD",
  stockStatus: "in_stock",
  genres: "Action, Adventure",
  platforms: "PC",
};

function parseCommaList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toShortDate(value) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleDateString();
}

function trendLabel(delta, suffix = "") {
  const rounded = Number.isFinite(delta) ? Number(delta.toFixed(1)) : 0;

  if (rounded === 0) {
    return `No change${suffix}`;
  }

  const arrow = rounded > 0 ? "↑" : "↓";
  const sign = rounded > 0 ? "+" : "";
  return `${arrow} ${sign}${rounded.toFixed(1)}${suffix}`;
}

function trendTone(delta) {
  const rounded = Number.isFinite(delta) ? Number(delta.toFixed(1)) : 0;

  if (rounded > 0) return "rgba(153,255,214,0.95)";
  if (rounded < 0) return "rgba(255,168,188,0.96)";
  return "rgba(231,233,241,0.78)";
}

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ gameCount: 0, reviewCount: 0, adminCount: 0 });
  const [games, setGames] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const [form, setForm] = useState(initialForm);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [flashMessage, setFlashMessage] = useState("");

  const [gameQuery, setGameQuery] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [gameSort, setGameSort] = useState("newest");
  const [gamePageSize, setGamePageSize] = useState(10);
  const [gamePage, setGamePage] = useState(1);

  const [reviewQuery, setReviewQuery] = useState("");
  const [reviewSort, setReviewSort] = useState("newest");
  const [reviewPageSize, setReviewPageSize] = useState(8);
  const [reviewPage, setReviewPage] = useState(1);

  async function loadOverview() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/admin/overview`, {
        headers: {
          ...authHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load admin data");
      }

      setStats(data.stats || { gameCount: 0, reviewCount: 0, adminCount: 0 });
      setGames(Array.isArray(data.games) ? data.games : []);
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    const stateMessage = location.state?.adminMessage;
    if (!stateMessage) return;

    setFlashMessage(String(stateMessage));
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const publisherOptions = useMemo(() => {
    const unique = new Set(
      games.map((g) => String(g.publisher || "Unknown").trim()).filter(Boolean)
    );

    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [games]);

  const kpi = useMemo(() => {
    const totalGames = safeNumber(stats.gameCount);
    const totalReviews = safeNumber(stats.reviewCount);
    const adminCount = safeNumber(stats.adminCount);

    const scoreValues = games.map((g) => safeNumber(g.score)).filter((s) => s > 0);
    const avgScore = scoreValues.length
      ? scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length
      : 0;

    const highRatedCount = games.filter((g) => safeNumber(g.score) >= 8).length;
    const noReviewCount = games.filter((g) => safeNumber(g.reviewCount) === 0).length;

    const recentSlice = games.slice(0, 12);
    const previousSlice = games.slice(12, 24);

    const recentScoreAvg = recentSlice.length
      ? recentSlice.reduce((sum, g) => sum + safeNumber(g.score), 0) / recentSlice.length
      : 0;
    const previousScoreAvg = previousSlice.length
      ? previousSlice.reduce((sum, g) => sum + safeNumber(g.score), 0) / previousSlice.length
      : 0;

    const recentReviewAvg = recentSlice.length
      ? recentSlice.reduce((sum, g) => sum + safeNumber(g.reviewCount), 0) / recentSlice.length
      : 0;
    const previousReviewAvg = previousSlice.length
      ? previousSlice.reduce((sum, g) => sum + safeNumber(g.reviewCount), 0) / previousSlice.length
      : 0;

    return {
      totalGames,
      totalReviews,
      adminCount,
      avgScore,
      highRatedCount,
      noReviewCount,
      scoreMomentum: recentScoreAvg - previousScoreAvg,
      reviewMomentum: recentReviewAvg - previousReviewAvg,
    };
  }, [games, stats]);



  const filteredGames = useMemo(() => {
    const q = gameQuery.trim().toLowerCase();

    let next = games.filter((g) => {
      const publisher = String(g.publisher || "Unknown");
      const score = safeNumber(g.score);

      const matchesQuery =
        !q ||
        String(g.title || "").toLowerCase().includes(q) ||
        publisher.toLowerCase().includes(q) ||
        String(g.year || "").toLowerCase().includes(q);

      const matchesPublisher = publisherFilter === "all" || publisher === publisherFilter;

      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "8plus" && score >= 8) ||
        (scoreFilter === "9plus" && score >= 9) ||
        (scoreFilter === "under8" && score > 0 && score < 8);

      return matchesQuery && matchesPublisher && matchesScore;
    });

    if (gameSort === "title_az") {
      next = [...next].sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
    } else if (gameSort === "score_desc") {
      next = [...next].sort((a, b) => safeNumber(b.score) - safeNumber(a.score));
    } else if (gameSort === "reviews_desc") {
      next = [...next].sort((a, b) => safeNumber(b.reviewCount) - safeNumber(a.reviewCount));
    } else if (gameSort === "year_desc") {
      next = [...next].sort((a, b) => safeNumber(b.year) - safeNumber(a.year));
    } else {
      next = [...next].sort((a, b) => safeNumber(b.id) - safeNumber(a.id));
    }

    return next;
  }, [games, gameQuery, publisherFilter, scoreFilter, gameSort]);

  const gameTotalPages = Math.max(1, Math.ceil(filteredGames.length / gamePageSize));
  const pagedGames = useMemo(() => {
    const start = (gamePage - 1) * gamePageSize;
    return filteredGames.slice(start, start + gamePageSize);
  }, [filteredGames, gamePage, gamePageSize]);

  useEffect(() => {
    setGamePage(1);
  }, [gameQuery, publisherFilter, scoreFilter, gameSort, gamePageSize]);

  useEffect(() => {
    if (gamePage > gameTotalPages) {
      setGamePage(gameTotalPages);
    }
  }, [gamePage, gameTotalPages]);

  const filteredReviews = useMemo(() => {
    const q = reviewQuery.trim().toLowerCase();

    let next = reviews.filter((r) => {
      if (!q) return true;

      return (
        String(r.gameTitle || "").toLowerCase().includes(q) ||
        String(r.userName || "").toLowerCase().includes(q) ||
        String(r.text || "").toLowerCase().includes(q)
      );
    });

    if (reviewSort === "score_desc") {
      next = [...next].sort((a, b) => safeNumber(b.score) - safeNumber(a.score));
    } else if (reviewSort === "score_asc") {
      next = [...next].sort((a, b) => safeNumber(a.score) - safeNumber(b.score));
    } else {
      next = [...next].sort(
        (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      );
    }

    return next;
  }, [reviews, reviewQuery, reviewSort]);

  const reviewTotalPages = Math.max(1, Math.ceil(filteredReviews.length / reviewPageSize));
  const pagedReviews = useMemo(() => {
    const start = (reviewPage - 1) * reviewPageSize;
    return filteredReviews.slice(start, start + reviewPageSize);
  }, [filteredReviews, reviewPage, reviewPageSize]);

  useEffect(() => {
    setReviewPage(1);
  }, [reviewQuery, reviewSort, reviewPageSize]);

  useEffect(() => {
    if (reviewPage > reviewTotalPages) {
      setReviewPage(reviewTotalPages);
    }
  }, [reviewPage, reviewTotalPages]);

  async function handleCreateGame(event) {
    event.preventDefault();
    setMessage("");

    try {
      setCreating(true);

      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        releaseYear: form.releaseYear,
        publisherName: form.publisherName,
        cover: form.cover,
        accent: form.accent,
        storeName: form.storeName,
        price: form.price,
        currency: form.currency,
        stockStatus: form.stockStatus,
        genres: parseCommaList(form.genres),
        platforms: parseCommaList(form.platforms),
      };

      const response = await fetch(`${API_BASE}/admin/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create game");
      }

      setForm(initialForm);
      setMessage("Game created successfully.");
      await loadOverview();
    } catch (err) {
      setMessage(err.message || "Failed to create game.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteGame(gameId) {
    const ok = window.confirm("Delete this game and all related records?");
    if (!ok) return;

    setBusyId(`game-${gameId}`);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/admin/games/${gameId}`, {
        method: "DELETE",
        headers: {
          ...authHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete game");
      }

      await loadOverview();
    } catch (err) {
      setMessage(err.message || "Failed to delete game.");
    } finally {
      setBusyId("");
    }
  }

  async function handleDeleteReview(reviewId) {
    const ok = window.confirm("Delete this review?");
    if (!ok) return;

    setBusyId(`review-${reviewId}`);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          ...authHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete review");
      }

      await loadOverview();
    } catch (err) {
      setMessage(err.message || "Failed to delete review.");
    } finally {
      setBusyId("");
    }
  }

  async function handleTogglePlayerBadge(review) {
    const isMarked = Boolean(review.isPlayerVerified);
    const key = `player-${review.id}`;
    const actionLabel = isMarked ? "remove" : "mark";

    const ok = window.confirm(
      isMarked
        ? `Remove player badge for ${review.userName} on ${review.gameTitle}?`
        : `Mark ${review.userName} as a player of ${review.gameTitle}?`
    );

    if (!ok) return;

    setBusyId(key);
    setMessage("");

    try {
      const response = await fetch(
        isMarked
          ? `${API_BASE}/admin/player-badges/${review.userId}/${review.gameId}`
          : `${API_BASE}/admin/player-badges`,
        {
          method: isMarked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: isMarked
            ? undefined
            : JSON.stringify({
              userId: review.userId,
              gameId: review.gameId,
            }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Failed to ${actionLabel} player badge`);
      }

      await loadOverview();
      setMessage(
        isMarked
          ? `Removed player badge for ${review.userName}.`
          : `Marked ${review.userName} as player for ${review.gameTitle}.`
      );
    } catch (err) {
      setMessage(err.message || `Failed to ${actionLabel} player badge.`);
    } finally {
      setBusyId("");
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <div className="card" style={{ marginTop: 14 }}>
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <div className="card" style={{ marginTop: 14 }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container adminShell" style={{ paddingBottom: 32 }}>
      {/* HERO SECTION: Cinematic dark premium header */}
      <section className="adminHero">
        <div className="adminHeroTop">
          <div>
            <div className="adminHeroKicker">⚙️ Admin Console</div>
            <h1 className="adminHeroTitle">Game & Review Management</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760, fontSize: 14 }}>
              Create games instantly and moderate community reviews from one unified dashboard.
            </p>
          </div>
          <button type="button" className="btn primary" onClick={loadOverview}>
            ↻ Refresh
          </button>
        </div>
      </section>

      {/* SUCCESS/FLASH MESSAGE: Premium notification */}
      {flashMessage ? (
        <section className="adminNotification success">
          <span className="adminNotificationIcon">✓</span>
          <span>{flashMessage}</span>
          <button
            type="button"
            className="adminNotificationClose"
            onClick={() => setFlashMessage("")}
          >
            ✕
          </button>
        </section>
      ) : null}

      {/* KPI STRIP: Cinematic dark premium metrics */}
      <section className="adminKpiStrip">
        <div className="adminKpiCard accent-pink">
          <div className="adminKpiContent">
            <div className="adminKpiLabel">Total Games</div>
            <div className="adminKpiValue">{kpi.totalGames}</div>
            <div className="adminKpiTrend neutral">
              High Rated: <strong>{kpi.highRatedCount}</strong>
            </div>
          </div>
        </div>

        <div className="adminKpiCard accent-cyan">
          <div className="adminKpiContent">
            <div className="adminKpiLabel">Total Reviews</div>
            <div className="adminKpiValue">{kpi.totalReviews}</div>
            <div className={`adminKpiTrend ${kpi.reviewMomentum >= 0 ? 'positive' : 'negative'}`}>
              {trendLabel(kpi.reviewMomentum, " per game")}
            </div>
          </div>
        </div>

        <div className="adminKpiCard accent-purple">
          <div className="adminKpiContent">
            <div className="adminKpiLabel">Average Score</div>
            <div className="adminKpiValue">{kpi.avgScore.toFixed(1)}</div>
            <div className={`adminKpiTrend ${kpi.scoreMomentum >= 0 ? 'positive' : 'negative'}`}>
              {trendLabel(kpi.scoreMomentum)}
            </div>
          </div>
        </div>

        <div className="adminKpiCard accent-mixed">
          <div className="adminKpiContent">
            <div className="adminKpiLabel">Admin Accounts</div>
            <div className="adminKpiValue">{kpi.adminCount}</div>
            <div className="adminKpiTrend neutral">
              Unreviewed: <strong>{kpi.noReviewCount}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* CREATE GAME FORM: Premium form section */}
      <section className="adminSection">
        <h2 className="adminSectionTitle">
          <span className="adminSectionIcon">➕</span>
          Create New Game
        </h2>

        <form onSubmit={handleCreateGame} className="adminForm">
          {/* Core Info Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Basic Information</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Game Title *</label>
                <input
                  className="adminFormField"
                  placeholder="e.g., Cyberpunk 2077"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Subtitle</label>
                <input
                  className="adminFormField"
                  placeholder="e.g., Phantom Liberty"
                  value={form.subtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>
            </div>
            <div className="adminFormGroup">
              <label className="adminFormLabel">Description</label>
              <textarea
                className="adminFormField"
                placeholder="Enter game description..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Media & Appearance</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Cover Image URL</label>
                <input
                  className="adminFormField"
                  placeholder="https://..."
                  value={form.cover}
                  onChange={(e) => setForm((prev) => ({ ...prev, cover: e.target.value }))}
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Accent Color</label>
                <input
                  className="adminFormField"
                  type="color"
                  value={form.accent}
                  onChange={(e) => setForm((prev) => ({ ...prev, accent: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Publisher & Release Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Publisher & Release</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Publisher</label>
                <input
                  className="adminFormField"
                  placeholder="e.g., CD Projekt Red"
                  value={form.publisherName}
                  onChange={(e) => setForm((prev) => ({ ...prev, publisherName: e.target.value }))}
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Release Year</label>
                <input
                  className="adminFormField"
                  type="number"
                  placeholder="YYYY"
                  value={form.releaseYear}
                  onChange={(e) => setForm((prev) => ({ ...prev, releaseYear: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Store & Pricing Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Store & Pricing</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Store</label>
                <input
                  className="adminFormField"
                  placeholder="e.g., Steam"
                  value={form.storeName}
                  onChange={(e) => setForm((prev) => ({ ...prev, storeName: e.target.value }))}
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Price</label>
                <input
                  className="adminFormField"
                  type="number"
                  placeholder="59.99"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Genres & Platforms</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Genres (comma separated)</label>
                <input
                  className="adminFormField"
                  placeholder="Action, Adventure, RPG"
                  value={form.genres}
                  onChange={(e) => setForm((prev) => ({ ...prev, genres: e.target.value }))}
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Platforms (comma separated)</label>
                <input
                  className="adminFormField"
                  placeholder="PC, PS5, Xbox Series X"
                  value={form.platforms}
                  onChange={(e) => setForm((prev) => ({ ...prev, platforms: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
            <button type="submit" className="btn primary" disabled={creating}>
              {creating ? "Creating..." : "Create Game"}
            </button>
            {message ? (
              <span className="adminNotification error" style={{ margin: 0, flex: 1 }}>
                <span className="adminNotificationIcon">⚠</span>
                <span>{message}</span>
              </span>
            ) : null}
          </div>
        </form>
      </section>

      {/* GAMES DATA GRID: Premium table section */}
      <section className="adminSection">
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <h2 className="adminSectionTitle" style={{ margin: 0 }}>
            <span className="adminSectionIcon">🎮</span>
            Games Grid
          </h2>
          <div className="adminBadge info">{filteredGames.length} result(s)</div>
        </div>

        {/* Filters Row */}
        <div
          className="grid"
          style={{
            marginBottom: 16,
            gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
            gap: 12,
          }}
        >
          <input
            className="adminFormField"
            placeholder="Search by title, publisher, or year"
            value={gameQuery}
            onChange={(e) => setGameQuery(e.target.value)}
          />

          <select
            className="adminFormField"
            value={publisherFilter}
            onChange={(e) => setPublisherFilter(e.target.value)}
          >
            {publisherOptions.map((publisher) => (
              <option key={publisher} value={publisher}>
                {publisher === "all" ? "All publishers" : publisher}
              </option>
            ))}
          </select>

          <select className="adminFormField" value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)}>
            <option value="all">All scores</option>
            <option value="9plus">Score 9+</option>
            <option value="8plus">Score 8+</option>
            <option value="under8">Under 8</option>
          </select>

          <select className="adminFormField" value={gameSort} onChange={(e) => setGameSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="title_az">Title A-Z</option>
            <option value="score_desc">Top score</option>
            <option value="reviews_desc">Most reviewed</option>
            <option value="year_desc">Newest year</option>
          </select>

          <select
            className="adminFormField"
            value={String(gamePageSize)}
            onChange={(e) => setGamePageSize(Number(e.target.value) || 10)}
          >
            <option value="8">8 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto", marginBottom: 16 }}>
          <table className="adminTable">
            <thead className="adminTableHead">
              <tr>
                <th>Game</th>
                <th>User</th>
                <th>Player</th>
                <th>Score</th>
                <th>Date</th>
                <th>Review</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="adminTableBody">
              {pagedGames.length > 0 ? (
                pagedGames.map((game) => {
                  const key = `game-${game.id}`;
                  return (
                    <tr key={game.id}>
                      <td className="adminTableCell">{game.title}</td>
                      <td className="adminTableCell">{game.publisher || "-"}</td>
                      <td className="adminTableCell">{game.year || "-"}</td>
                      <td className="adminTableCell">
                        <span className="adminBadge success">{safeNumber(game.score).toFixed(1)}</span>
                      </td>
                      <td className="adminTableCell">{game.reviewCount || 0}</td>
                      <td className="adminTableCell">
                        <div className="adminTableActions">
                          <Link
                            to={`/games/${game.id}`}
                            className="adminTableActionBtn"
                          >
                            View
                          </Link>
                          <Link
                            to={`/admin/games/${game.id}/edit`}
                            className="adminTableActionBtn"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="adminTableActionBtn danger"
                            disabled={busyId === key}
                            onClick={() => handleDeleteGame(game.id)}
                          >
                            {busyId === key ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "24px 14px", textAlign: "center" }}>
                    <div className="adminEmptyState">
                      <div className="adminEmptyStateIcon">📭</div>
                      <div className="adminEmptyStateText">No games found for current filters.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div className="muted" style={{ fontSize: 13 }}>
            Page {gamePage} of {gameTotalPages}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn subtle"
              onClick={() => setGamePage((prev) => Math.max(1, prev - 1))}
              disabled={gamePage <= 1}
            >
              ← Previous
            </button>
            <button
              type="button"
              className="btn subtle"
              onClick={() => setGamePage((prev) => Math.min(gameTotalPages, prev + 1))}
              disabled={gamePage >= gameTotalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS DATA GRID: Premium table section */}
      <section className="adminSection">
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <h2 className="adminSectionTitle" style={{ margin: 0 }}>
            <span className="adminSectionIcon">💬</span>
            Reviews Grid
          </h2>
          <div className="adminBadge info">{filteredReviews.length} result(s)</div>
        </div>

        {/* Filters Row */}
        <div
          className="grid"
          style={{
            marginBottom: 16,
            gridTemplateColumns: "2fr 1fr 140px",
            gap: 12,
          }}
        >
          <input
            className="adminFormField"
            placeholder="Search by game, user, or review text"
            value={reviewQuery}
            onChange={(e) => setReviewQuery(e.target.value)}
          />

          <select className="adminFormField" value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="score_desc">Score high to low</option>
            <option value="score_asc">Score low to high</option>
          </select>

          <select
            className="adminFormField"
            value={String(reviewPageSize)}
            onChange={(e) => setReviewPageSize(Number(e.target.value) || 8)}
          >
            <option value="8">8 / page</option>
            <option value="12">12 / page</option>
            <option value="20">20 / page</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto", marginBottom: 16 }}>
          <table className="adminTable">
            <thead className="adminTableHead">
              <tr>
                <th>Game</th>
                <th>User</th>
                <th>Player</th>
                <th>Score</th>
                <th>Date</th>
                <th>Review</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="adminTableBody">
              {pagedReviews.length > 0 ? (
                pagedReviews.map((review) => {
                  const reviewKey = `review-${review.id}`;
                  const playerKey = `player-${review.id}`;

                  return (
                    <tr key={review.id}>
                      <td className="adminTableCell">{review.gameTitle}</td>

                      <td className="adminTableCell">
                        <div style={{ display: "grid", gap: 4 }}>
                          <span>{review.userName}</span>
                          <span className="muted" style={{ fontSize: 12 }}>
                            User ID: {review.userId}
                          </span>
                        </div>
                      </td>

                      <td className="adminTableCell">
                        {review.isPlayerVerified ? (
                          <span className="adminBadge success">Player</span>
                        ) : (
                          <span className="adminBadge info">No badge</span>
                        )}
                      </td>

                      <td className="adminTableCell">
                        <span className="adminBadge info">{review.score}</span>
                      </td>

                      <td className="adminTableCell">{toShortDate(review.date)}</td>

                      <td className="adminTableCell muted" style={{ maxWidth: 260 }}>
                        {String(review.text || "").slice(0, 80) || "-"}
                      </td>

                      <td className="adminTableCell">
                        <div className="adminTableActions">
                          <button
                            type="button"
                            className={`adminTableActionBtn ${review.isPlayerVerified ? "danger" : ""}`}
                            disabled={busyId === playerKey}
                            onClick={() => handleTogglePlayerBadge(review)}
                          >
                            {busyId === playerKey
                              ? "..."
                              : review.isPlayerVerified
                                ? "Remove Player"
                                : "Mark Player"}
                          </button>

                          <button
                            type="button"
                            className="adminTableActionBtn danger"
                            disabled={busyId === reviewKey}
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            {busyId === reviewKey ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: "24px 14px", textAlign: "center" }}>
                    <div className="adminEmptyState">
                      <div className="adminEmptyStateIcon">📭</div>
                      <div className="adminEmptyStateText">No reviews found for current filters.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div className="muted" style={{ fontSize: 13 }}>
            Page {reviewPage} of {reviewTotalPages}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn subtle"
              onClick={() => setReviewPage((prev) => Math.max(1, prev - 1))}
              disabled={reviewPage <= 1}
            >
              ← Previous
            </button>
            <button
              type="button"
              className="btn subtle"
              onClick={() => setReviewPage((prev) => Math.min(reviewTotalPages, prev + 1))}
              disabled={reviewPage >= reviewTotalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
