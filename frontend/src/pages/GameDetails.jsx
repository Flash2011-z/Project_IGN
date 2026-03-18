import { Link, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { AUTH_EVENT, WISHLIST_EVENT, getStoredUser } from "../utils/auth";
import { addWishlistGame, fetchWishlistIds, removeWishlistGame } from "../utils/wishlist";
import { addCartItem } from "../utils/cart";

const API_BASE = "http://localhost:3000";

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

const seedReviews = [
  {
    id: 901,
    gameId: 1,
    user: "Gojo",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Gojo",
    score: 9.7,
    text: "Cinematic storytelling, insane detail, and a world that feels alive. A masterpiece experience.",
    date: "2026-02-09",
  },
  {
    id: 902,
    gameId: 2,
    user: "Taklu",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Naruto",
    score: 9.1,
    text: "Still the king of sandbox chaos. Missions, driving, and atmosphere are top-tier.",
    date: "2026-02-08",
  },
  {
    id: 903,
    gameId: 3,
    user: "Shafik",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Mikasa",
    score: 8.6,
    text: "Night City looks unreal. Great build variety and combat, with strong vibe and story moments.",
    date: "2026-02-07",
  },
];

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
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => setImgSrc(PLACEHOLDER)}
      style={style}
    />
  );
}

export default function GameDetails() {
  const params = useParams();
  const gameId = safeInt(params.id);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState(seedReviews);
  const [name, setName] = useState("");
  const [score, setScore] = useState("9.0");
  const [text, setText] = useState("");
  const [reviewSort, setReviewSort] = useState("new");

  const [wishlist, setWishlist] = useState([]);
  const [addingListingId, setAddingListingId] = useState(null);

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
          score: data.score,
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
      } catch (err) {
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
    if (!game) return [];
    const list = reviews.filter((r) => r.gameId === game.id);

    if (reviewSort === "top") {
      return list.slice(0).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return String(b.date).localeCompare(String(a.date));
      });
    }

    return list.slice(0).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [reviews, game, reviewSort]);

  const avgScore = useMemo(() => {
    if (!game) return 0;
    if (gameReviews.length === 0) return game.score;
    let sum = 0;
    for (let i = 0; i < gameReviews.length; i++) sum += gameReviews[i].score;
    return Math.round((sum / gameReviews.length) * 10) / 10;
  }, [game, gameReviews]);

  const ratingFill = useMemo(() => clamp((avgScore / 10) * 100, 0, 100), [avgScore]);

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = String(name || "").trim();
    const trimmedText = String(text || "").trim();
    const nScore = parseFloat(score);

    if (!game) return;
    if (trimmedName.length === 0) return alert("Please enter your name.");
    if (trimmedText.length < 10) return alert("Review text is too short (min 10 chars).");
    if (Number.isNaN(nScore) || nScore < 0 || nScore > 10) return alert("Score must be between 0 and 10.");

    const newReview = {
      id: Date.now(),
      gameId: game.id,
      user: trimmedName,
      avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=" + encodeURIComponent(trimmedName),
      score: Math.round(nScore * 10) / 10,
      text: trimmedText,
      date: new Date().toISOString().slice(0, 10),
    };

    setReviews([newReview].concat(reviews));
    setName("");
    setScore("9.0");
    setText("");
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
        .catch(() => {});
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

          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {gameReviews.length === 0 ? (
              <div className="glass" style={{ padding: 12 }}>
                <div className="muted">No reviews yet. Add the first one below.</div>
              </div>
            ) : (
              gameReviews.map((r) => (
                <div key={r.id} className="glass" style={{ padding: 12, display: "flex", gap: 12 }}>
                  <img
                    src={r.avatar}
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
                      <div style={{ fontWeight: 950 }}>{r.user}</div>
                      <span className="muted">•</span>
                      <div className="muted" style={{ fontWeight: 800 }}>
                        {r.date}
                      </div>

                      <div style={{ marginLeft: "auto", fontWeight: 950 }}>
                        <span
                          style={{
                            background: "rgba(255,255,255,0.10)",
                            border: "1px solid rgba(255,255,255,0.14)",
                            padding: "4px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {r.score}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: "8px 0 0" }} className="text-premium">
                      {r.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Add a Review (sample)</h3>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 160px" }}>
              <input
                className="input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            <button className="btn primary" type="submit">
              Submit Review
            </button>

            <div className="muted" style={{ fontWeight: 700 }}>
              Note: This is local-only sample data. When backend is ready, we’ll post the review to your API.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}