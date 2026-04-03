import { Link, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { AUTH_EVENT, WISHLIST_EVENT, getStoredUser, authHeader } from "../utils/auth";
import { addWishlistGame, fetchWishlistIds, removeWishlistGame } from "../utils/wishlist";
import { addCartItem } from "../utils/cart";
import { getAvatarUrl } from "../utils/avatar";
import CommentThread from "../components/CommentThread";

const API_BASE = "http://localhost:4000";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0b0c10"/>
        <stop offset="1" stop-color="#1f2330"/>
      </linearGradient>
    </defs>
    <rect width="1400" height="800" fill="url(#g)"/>
    <text x="70" y="180" fill="#ffffff" font-family="Arial" font-size="74" font-weight="700" opacity="0.9">
      Game Cover
    </text>
    <text x="70" y="260" fill="#ffffff" font-family="Arial" font-size="34" opacity="0.65">
      Image unavailable — placeholder shown
    </text>
  </svg>
`);

function safeInt(value) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return null;
  return n;
}

function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

function CoverImg({ src, alt, style }) {
  const [hasError, setHasError] = useState(false);
  const nextSrc = hasError ? PLACEHOLDER : (src || PLACEHOLDER);

  return (
    <img
      key={src || PLACEHOLDER}
      src={nextSrc}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      style={style}
    />
  );
}

function renderReviewBadge(review) {
  const wrapBase = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "4px 10px 4px 6px",
    borderRadius: 999,
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.35px",
    textTransform: "uppercase",
    lineHeight: 1,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };

  const orbBase = {
    width: 18,
    height: 18,
    minWidth: 18,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    position: "relative",
    zIndex: 2,
    fontSize: 8,
    fontWeight: 900,
  };

  if (review?.isAdmin) {
    return (
      <span
        title="GameZone Admin"
        style={{
          ...wrapBase,
          color: "#ffe9c7",
          background:
            "linear-gradient(135deg, rgba(30,10,16,0.95), rgba(72,22,34,0.92) 44%, rgba(122,82,28,0.80) 100%)",
          border: "1px solid rgba(228,181,91,0.30)",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.30), 0 0 14px rgba(228,181,91,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.00) 42%)",
            pointerEvents: "none",
          }}
        />

        <span
          style={{
            position: "absolute",
            left: -14,
            top: -14,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(228,181,91,0.16), transparent 68%)",
            pointerEvents: "none",
          }}
        />

        <span
          style={{
            ...orbBase,
            color: "#2b1403",
            background:
              "radial-gradient(circle at 30% 30%, #fff4d8, #efc878 46%, #c68b2e 74%, #74460f 100%)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow:
              "0 0 8px rgba(245,158,11,0.12), inset 0 1px 0 rgba(255,255,255,0.22)",
          }}
        >
          ♛
        </span>

        <span style={{ position: "relative", zIndex: 2 }}>Admin</span>
      </span>
    );
  }

  if (review?.badge === "verified_player") {
    return (
      <span
        title="Verified player"
        style={{
          ...wrapBase,
          color: "#eaf7ff",
          background:
            "linear-gradient(135deg, rgba(7,18,30,0.94), rgba(13,46,72,0.92) 45%, rgba(29,99,140,0.82) 100%)",
          border: "1px solid rgba(124,192,230,0.30)",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.30), 0 0 14px rgba(56,189,248,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.00) 42%)",
            pointerEvents: "none",
          }}
        />

        <span
          style={{
            position: "absolute",
            left: -14,
            top: -14,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.20), transparent 68%)",
            pointerEvents: "none",
          }}
        />

        <span
          style={{
            ...orbBase,
            color: "#07141d",
            background:
              "radial-gradient(circle at 30% 30%, #f4fbff, #9dd8f7 45%, #4ea9dc 72%, #1d5d84 100%)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow:
              "0 0 10px rgba(56,189,248,0.20), inset 0 1px 0 rgba(255,255,255,0.26)",
          }}
        >
          ✦
        </span>

        <span style={{ position: "relative", zIndex: 2 }}>Player</span>
      </span>
    );
  }

  if (review?.badge === "purchased") {
    return (
      <span
        title="Purchased through GameZone"
        style={{
          ...wrapBase,
          color: "#fff3d6",
          background:
            "linear-gradient(135deg, rgba(20,12,6,0.95), rgba(64,37,14,0.92) 42%, rgba(128,84,28,0.82) 100%)",
          border: "1px solid rgba(221,176,81,0.30)",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.30), 0 0 14px rgba(245,158,11,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.00) 42%)",
            pointerEvents: "none",
          }}
        />

        <span
          style={{
            position: "absolute",
            left: -14,
            top: -14,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.16), transparent 68%)",
            pointerEvents: "none",
          }}
        />

        <span
          style={{
            ...orbBase,
            color: "#2a1704",
            background:
              "radial-gradient(circle at 30% 30%, #fff7de, #f1cf82 44%, #d49a39 72%, #7a4e14 100%)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow:
              "0 0 10px rgba(245,158,11,0.14), inset 0 1px 0 rgba(255,255,255,0.22)",
          }}
        >
          ◆
        </span>

        <span style={{ position: "relative", zIndex: 2 }}>Purchased</span>
      </span>
    );
  }

  return null;
}

export default function GameDetails() {
  const params = useParams();
  const gameId = safeInt(params.id);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewText, setEditingReviewText] = useState("");
  const [editingReviewScore, setEditingReviewScore] = useState("");
  const [reviewActionKey, setReviewActionKey] = useState("");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");

  const [score, setScore] = useState("9.0");
  const [text, setText] = useState("");
  const [reviewSort, setReviewSort] = useState("new");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const [wishlist, setWishlist] = useState([]);
  const [addingListingId, setAddingListingId] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => getStoredUser());

  useEffect(() => {
    function syncCurrentUser() {
      setCurrentUser(getStoredUser());
    }

    syncCurrentUser();

    window.addEventListener("storage", syncCurrentUser);
    window.addEventListener(AUTH_EVENT, syncCurrentUser);

    return () => {
      window.removeEventListener("storage", syncCurrentUser);
      window.removeEventListener(AUTH_EVENT, syncCurrentUser);
    };
  }, []);

  useEffect(() => {
    async function fetchGame() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/games/${gameId}`);

        if (!response.ok) {
          throw new Error("Game not found");
        }

        const data = await response.json();

        setGame({
          id: data.id,
          title: data.title,
          subtitle: data.subtitle,
          score: Number(data.score || 0),
          year: data.year,
          genres: data.genres || [],
          platforms: data.platforms || [],
          developer: data.developer || data.publisher || "Unknown",
          publisher: data.publisher || "Unknown",
          cover: data.cover,
          accent: data.accent || "#ff2d55",
          description: data.description,
          listings: Array.isArray(data.listings) ? data.listings : [],
        });
      } catch {
        setError("Failed to fetch game");
      } finally {
        setLoading(false);
      }
    }

    if (gameId !== null) {
      fetchGame();
    }
  }, [gameId]);

  useEffect(() => {
    async function loadReviews() {
      if (gameId === null) return;

      try {
        setReviewsLoading(true);
        setReviewsError("");

        const response = await fetch(`${API_BASE}/games/${gameId}/reviews`, {
          headers: authHeader(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
        setReviewsError("Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    }

    loadReviews();
  }, [gameId, currentUser?.id]);

  useEffect(() => {
    async function fetchComments() {
      if (gameId === null) return;

      try {
        setCommentsLoading(true);
        setCommentsError("");
        setComments([]);

        const response = await fetch(`${API_BASE}/games/${gameId}/comments`, {
          headers: authHeader(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      } catch {
        setComments([]);
        setCommentsError("Failed to load comments");
      } finally {
        setCommentsLoading(false);
      }
    }

    fetchComments();
  }, [gameId, currentUser?.id]);

  useEffect(() => {
    async function loadWishlist() {
      const user = getStoredUser();

      if (!user?.id) {
        setWishlist([]);
        return;
      }

      try {
        const ids = await fetchWishlistIds(user.id);
        setWishlist(Array.isArray(ids) ? ids : []);
      } catch {
        setWishlist([]);
      }
    }

    loadWishlist();

    window.addEventListener("focus", loadWishlist);
    window.addEventListener("storage", loadWishlist);
    window.addEventListener(AUTH_EVENT, loadWishlist);
    window.addEventListener(WISHLIST_EVENT, loadWishlist);

    return () => {
      window.removeEventListener("focus", loadWishlist);
      window.removeEventListener("storage", loadWishlist);
      window.removeEventListener(AUTH_EVENT, loadWishlist);
      window.removeEventListener(WISHLIST_EVENT, loadWishlist);
    };
  }, []);

  async function toggleWish(id) {
    const user = getStoredUser();

    if (!user?.id) {
      alert("Please login to use wishlist.");
      return;
    }

    const exists = wishlist.indexOf(id) !== -1;
    const previous = wishlist;
    const next = exists ? wishlist.filter((x) => x !== id) : [id, ...wishlist];

    setWishlist(next);

    try {
      if (exists) {
        await removeWishlistGame(user.id, id);
      } else {
        await addWishlistGame(user.id, id);
      }
    } catch {
      setWishlist(previous);
      alert("Failed to update wishlist.");
    }
  }

  async function handleAddToCart(listingId) {
    const user = getStoredUser();

    if (!user?.id) {
      alert("Please login first to add items to cart.");
      return;
    }

    try {
      setAddingListingId(listingId);
      await addCartItem(user.id, listingId, 1);
      alert("Added to cart.");
    } catch (err) {
      alert(err.message || "Failed to add to cart.");
    } finally {
      setAddingListingId(null);
    }
  }

  const wished = game ? wishlist.indexOf(game.id) !== -1 : false;

  const gameReviews = useMemo(() => {
    const list = Array.isArray(reviews) ? reviews.slice() : [];

    if (reviewSort === "top") {
      return list.sort((a, b) => {
        const scoreDiff = Number(b.score || 0) - Number(a.score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return String(b.date || "").localeCompare(String(a.date || ""));
      });
    }

    return list.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  }, [reviews, reviewSort]);

  const avgScore = useMemo(() => {
    if (gameReviews.length === 0) return Number(game?.score || 0);

    let sum = 0;
    for (let i = 0; i < gameReviews.length; i++) {
      sum += Number(gameReviews[i].score || 0);
    }

    return Math.round((sum / gameReviews.length) * 10) / 10;
  }, [gameReviews, game]);

  const ratingFill = useMemo(() => clamp((avgScore / 10) * 100, 0, 100), [avgScore]);

  const userHasReviewed = useMemo(() => {
    if (!currentUser?.id) return false;
    return gameReviews.some((r) => Number(r.userId) === Number(currentUser.id));
  }, [gameReviews, currentUser]);

  const commentsByReview = useMemo(() => {
    const grouped = new Map();

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const reviewId = Number(comment.userReviewId);

      if (!grouped.has(reviewId)) {
        grouped.set(reviewId, []);
      }

      grouped.get(reviewId).push(comment);
    }

    return grouped;
  }, [comments]);

  async function loadReviews() {
    if (gameId === null) return;

    try {
      setReviewsLoading(true);
      setReviewsError("");

      const response = await fetch(`${API_BASE}/games/${gameId}/reviews`, {
        headers: authHeader(),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      // keep existing reviews if reload fails
    } finally {
      setReviewsLoading(false);
    }
  }

  async function loadComments() {
    if (gameId === null) return;

    try {
      setCommentsLoading(true);
      setCommentsError("");

      const response = await fetch(`${API_BASE}/games/${gameId}/comments`, {
        headers: authHeader(),
      });

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setCommentsError("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  }

  async function mutateComment(url, method, body) {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Failed to update comment");
    }

    await loadComments();
    return data;
  }

  async function handleCreateComment(reviewId, content) {
    return mutateComment(`${API_BASE}/reviews/${reviewId}/comments`, "POST", { content });
  }

  async function handleReplyComment(commentId, content) {
    return mutateComment(`${API_BASE}/comments/${commentId}/replies`, "POST", { content });
  }

  async function handleEditComment(commentId, content) {
    return mutateComment(`${API_BASE}/comments/${commentId}`, "PUT", { content });
  }

  async function handleDeleteComment(commentId) {
    return mutateComment(`${API_BASE}/comments/${commentId}`, "DELETE");
  }

  async function handleLoveComment(commentId) {
    return mutateComment(`${API_BASE}/comments/${commentId}/love`, "POST");
  }

  function startEditReview(review) {
    setEditingReviewId(review.id);
    setEditingReviewText(String(review.text || ""));
    setEditingReviewScore(String(review.score ?? ""));
  }

  function cancelEditReview() {
    setEditingReviewId(null);
    setEditingReviewText("");
    setEditingReviewScore("");
  }

  async function mutateReview(url, method, body, busyKey) {
    try {
      setReviewActionKey(busyKey || "");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to update review");
      }

      await loadReviews();
      return data;
    } finally {
      setReviewActionKey("");
    }
  }

  async function handleEditReview(reviewId) {
    const trimmedText = String(editingReviewText || "").trim();
    const nScore = parseFloat(editingReviewScore);

    if (trimmedText.length < 10) {
      alert("Review text is too short (min 10 chars).");
      return;
    }

    if (Number.isNaN(nScore) || nScore < 0 || nScore > 10) {
      alert("Score must be between 0 and 10.");
      return;
    }

    try {
      await mutateReview(
        `${API_BASE}/reviews/${reviewId}`,
        "PUT",
        {
          reviewText: trimmedText,
          score: Math.round(nScore * 10) / 10,
        },
        `edit-${reviewId}`
      );
      cancelEditReview();
    } catch (err) {
      alert(err.message || "Failed to update review.");
    }
  }

  async function handleDeleteReview(reviewId) {
    const ok = window.confirm("Delete this review? This cannot be undone.");

    if (!ok) return;

    try {
      await mutateReview(`${API_BASE}/reviews/${reviewId}`, "DELETE", null, `delete-${reviewId}`);
      if (editingReviewId === reviewId) {
        cancelEditReview();
      }
    } catch (err) {
      alert(err.message || "Failed to delete review.");
    }
  }

  async function handleLoveReview(reviewId) {
    if (!currentUser?.id) {
      alert("Please login to love reviews.");
      return;
    }

    try {
      await mutateReview(`${API_BASE}/reviews/${reviewId}/love`, "POST", null, `love-${reviewId}`);
    } catch (err) {
      alert(err.message || "Failed to update review love.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const user = getStoredUser();
    const trimmedText = String(text || "").trim();
    const nScore = parseFloat(score);

    setReviewMessage("");

    if (!game) return;

    if (!user?.id) {
      alert("Please login to write a review.");
      return;
    }

    if (trimmedText.length < 10) {
      alert("Review text is too short (min 10 chars).");
      return;
    }

    if (Number.isNaN(nScore) || nScore < 0 || nScore > 10) {
      alert("Score must be between 0 and 10.");
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await fetch(`${API_BASE}/games/${game.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({
          userId: user.id,
          score: Math.round(nScore * 10) / 10,
          reviewText: trimmedText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to submit review.");
        return;
      }

      setScore("9.0");
      setText("");
      setReviewMessage("Review submitted successfully.");
      await loadReviews();
    } catch {
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  }

  function handleShare() {
    if (!game) return;
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: game.title,
          text: "Check this game:",
          url,
        })
        .catch(() => { });
      return;
    }

    try {
      navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      alert(url);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: 14 }}>
          Loading game details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: 14 }}>
          {error}
        </div>
      </div>
    );
  }

  if (gameId === null) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ marginTop: 0 }}>Invalid game ID</h2>
          <p className="muted">The URL parameter is not a valid number.</p>
          <Link to="/games" className="btn primary">
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ marginTop: 0 }}>Game not found</h2>
          <p className="muted">No game exists with ID: {gameId}</p>
          <Link to="/games" className="btn primary">
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: 24 }}>
      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Link to="/games" className="btn ghost">
          ← Back
        </Link>

        <div className="muted" style={{ fontWeight: 800 }}>
          Games / <span style={{ color: "#fff" }}>{game.title}</span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn subtle" onClick={handleShare}>
            Share
          </button>

          <button
            type="button"
            className={"btn subtle " + (wished ? "activePillBtn" : "")}
            onClick={() => toggleWish(game.id)}
            title={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wished ? "♥ Wishlisted" : "♡ Wishlist"}
          </button>
        </div>
      </div>

      <section className="card" style={{ marginTop: 14, padding: 0, overflow: "hidden", borderRadius: 18 }}>
        <div
          className="poster"
          style={{
            height: 380,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CoverImg
            src={game.cover}
            alt={game.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: "scale(1.02)",
            }}
          />

          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "end" }}>
            <div style={{ padding: 16, width: "100%" }}>
              <div
                className="glass"
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 12px",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div className="muted" style={{ fontWeight: 900 }}>
                    {game.subtitle} • {game.year}
                  </div>

                  <h1 style={{ margin: "6px 0 0", fontSize: 36, fontWeight: 950, letterSpacing: -0.7 }}>
                    {game.title}
                  </h1>

                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div
                      style={{
                        height: 8,
                        width: 180,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.14)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: ratingFill + "%",
                          background: game.accent,
                        }}
                      />
                    </div>

                    <div className="muted" style={{ fontWeight: 800 }}>
                      Community score
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 950,
                    background: game.accent,
                    color: "#0b0c10",
                    padding: "10px 14px",
                    borderRadius: 999,
                    minWidth: 92,
                    textAlign: "center",
                  }}
                >
                  {avgScore}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={"wishBtn " + (wished ? "active" : "")}
            onClick={() => toggleWish(game.id)}
            title={wished ? "Remove from wishlist" : "Add to wishlist"}
            style={{ position: "absolute", top: 12, right: 12 }}
          >
            {wished ? "♥" : "♡"}
          </button>
        </div>
      </section>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <div className="card">
          <h2 style={{ marginTop: 0, fontWeight: 950, letterSpacing: -0.3 }}>Overview</h2>

          <p className="text-premium" style={{ marginTop: 8 }}>
            {game.description}
          </p>

          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {game.genres.map((tag) => (
              <span
                key={tag}
                className="chip"
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {game.listings?.length > 0 ? (
            <div style={{ marginTop: 22 }}>
              <h3 style={{ marginTop: 0, fontWeight: 950 }}>Available Stores</h3>

              <div style={{ display: "grid", gap: 12 }}>
                {game.listings.map((listing) => (
                  <div
                    key={listing.listing_id}
                    className="glass"
                    style={{
                      padding: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 900, fontSize: 17 }}>
                        {listing.store_name || "Store"}
                      </div>

                      <div className="muted" style={{ marginTop: 4 }}>
                        {Number(listing.price || 0).toFixed(2)} {listing.currency}
                      </div>

                      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                        {listing.stock_status || "Unknown stock"}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => handleAddToCart(listing.listing_id)}
                      disabled={addingListingId === listing.listing_id}
                    >
                      {addingListingId === listing.listing_id ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass" style={{ padding: 12, marginTop: 22 }}>
              <div className="muted">No active store listings available for this game yet.</div>
            </div>
          )}
        </div>

        <div className="card" style={{ position: "sticky", top: 12 }}>
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Game Info</h3>

          <div style={{ display: "grid", gap: 10 }}>
            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>
                Developer
              </div>
              <div style={{ fontWeight: 900 }}>{game.developer}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>
                Platforms
              </div>
              <div style={{ fontWeight: 900 }}>{game.platforms.join(", ")}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>
                Release Year
              </div>
              <div style={{ fontWeight: 900 }}>{game.year}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>
                Publisher
              </div>
              <div style={{ fontWeight: 900 }}>{game.publisher}</div>
            </div>

            <Link to="/games" className="btn primary" style={{ textAlign: "center" }}>
              Browse More
            </Link>

            <Link to="/cart" className="btn ghost" style={{ textAlign: "center" }}>
              Open Cart
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
        <div className="card">
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontWeight: 950, letterSpacing: -0.3 }}>Reviews</h2>

            <span className="muted" style={{ fontWeight: 800 }}>
              ({gameReviews.length})
            </span>

            <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span className="muted">
                Avg: <b style={{ color: "#fff" }}>{avgScore}</b>/10
              </span>

              <select
                className="input"
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                style={{ width: 170, padding: "9px 10px" }}
                title="Sort reviews"
              >
                <option value="new">Newest first</option>
                <option value="top">Top rated</option>
              </select>
            </div>
          </div>

          {commentsError ? (
            <div className="glass" style={{ marginTop: 12, padding: 12 }}>
              <div className="muted">{commentsError}</div>
            </div>
          ) : null}

          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {reviewsLoading ? (
              <div className="glass" style={{ padding: 12 }}>
                <div className="muted">Loading reviews...</div>
              </div>
            ) : reviewsError ? (
              <div className="glass" style={{ padding: 12 }}>
                <div className="muted">{reviewsError}</div>
              </div>
            ) : gameReviews.length === 0 ? (
              <div className="glass" style={{ padding: 12 }}>
                <div className="muted">No reviews yet. Add the first one below.</div>
              </div>
            ) : (
              gameReviews.map((r) => {
                const isOwner = Number(currentUser?.id) === Number(r.userId);
                const isEditing = editingReviewId === r.id;
                const loved = Boolean(r.lovedByMe);
                const reviewBadge = renderReviewBadge(r);
                return (
                  <div key={r.id} style={{ display: "grid", gap: 12 }}>
                    <div className="glass" style={{ padding: 12, display: "flex", gap: 12 }}>
                      <img
                        src={r.avatar || getAvatarUrl(r)}
                        alt={r.user}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.14)",
                          background: "rgba(255,255,255,0.06)",
                        }}
                      />

                      <div style={{ flex: 1 }}>
<div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
    <div style={{ fontWeight: 950 }}>{r.user}</div>
    {reviewBadge}
  </div>

  <span className="muted">•</span>

  <div className="muted" style={{ fontWeight: 800 }}>
    {String(r.date || "").slice(0, 10)}
  </div>

  {String(r.updatedAt || "").slice(0, 19) !== String(r.date || "").slice(0, 19) ? (
    <span className="badge">Edited</span>
  ) : null}

  <div style={{ marginLeft: "auto", fontWeight: 950 }}>
    <span
      style={{
        background: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.14)",
        padding: "4px 10px",
        borderRadius: 999,
      }}
    >
      {Number(r.score || 0).toFixed(1)}
    </span>
  </div>
</div>

                        {isEditing ? (
                          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 160px" }}>
                              <textarea
                                className="input"
                                rows={4}
                                value={editingReviewText}
                                onChange={(e) => setEditingReviewText(e.target.value)}
                                style={{ resize: "vertical" }}
                              />

                              <input
                                className="input"
                                placeholder="Score (0-10)"
                                value={editingReviewScore}
                                onChange={(e) => setEditingReviewScore(e.target.value)}
                              />
                            </div>

                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                              <button
                                type="button"
                                className="btn primary"
                                onClick={() => handleEditReview(r.id)}
                                disabled={reviewActionKey === `edit-${r.id}`}
                              >
                                {reviewActionKey === `edit-${r.id}` ? "Saving..." : "Save Review"}
                              </button>

                              <button type="button" className="btn ghost" onClick={cancelEditReview}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={{ margin: "8px 0 0" }} className="text-premium">
                              {r.text}
                            </p>

                            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <button
                                type="button"
                                className={`comment-thread__pill ${loved ? "comment-thread__pill--active" : ""}`}
                                onClick={() => handleLoveReview(r.id)}
                                disabled={!currentUser?.id || reviewActionKey === `love-${r.id}`}
                              >
                                <span>{loved ? "♥" : "♡"}</span>
                                <span>{Number(r.loveCount || 0)}</span>
                              </button>

                              {isOwner ? (
                                <>
                                  <button
                                    type="button"
                                    className="comment-thread__link"
                                    onClick={() => startEditReview(r)}
                                    disabled={reviewActionKey === `edit-${r.id}` || reviewActionKey === `delete-${r.id}`}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="comment-thread__link comment-thread__link--danger"
                                    onClick={() => handleDeleteReview(r.id)}
                                    disabled={reviewActionKey === `delete-${r.id}`}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <CommentThread
                      review={r}
                      comments={commentsByReview.get(Number(r.id)) || []}
                      currentUser={currentUser}
                      loading={commentsLoading}
                      onCreateComment={handleCreateComment}
                      onReplyComment={handleReplyComment}
                      onEditComment={handleEditComment}
                      onDeleteComment={handleDeleteComment}
                      onLoveComment={handleLoveComment}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Write a Review</h3>

          {!currentUser?.id ? (
            <div className="glass" style={{ padding: 12 }}>
              <div className="muted">Please login to write a review.</div>
            </div>
          ) : userHasReviewed ? (
            <div className="glass" style={{ padding: 12 }}>
              <div className="muted">You already reviewed this game.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 160px" }}>
                <input
                  className="input"
                  value={currentUser.name || "Player"}
                  disabled
                  readOnly
                />

                <input
                  className="input"
                  placeholder="Score (0-10)"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>

              <textarea
                className="input"
                rows={4}
                placeholder="Write your review (min 10 characters)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ resize: "vertical" }}
              />

              <button className="btn primary" type="submit" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>

              {reviewMessage ? (
                <div className="muted" style={{ fontWeight: 700, color: "#9be37a" }}>
                  {reviewMessage}
                </div>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}