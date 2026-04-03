import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AUTH_EVENT, getStoredUser, getStoredToken, authHeader } from "../utils/auth";

function formatDate(iso) {
  return iso;
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
          border: "1px solid rgba(124, 192, 230, 0.30)",
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

        <span
          style={{
            position: "relative",
            zIndex: 2,
            textShadow: "0 0 8px rgba(56,189,248,0.10)",
          }}
        >
          Player
        </span>
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
          border: "1px solid rgba(221, 176, 81, 0.30)",
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

        <span
          style={{
            position: "relative",
            zIndex: 2,
            textShadow: "0 0 8px rgba(245,158,11,0.08)",
          }}
        >
          Purchased
        </span>
      </span>
    );
  }

  return null;
}

export default function Home() {
  const API_BASE = "http://localhost:4000";

  const [hero, setHero] = useState(null);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [reviewActionKey, setReviewActionKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getStoredToken() && !!getStoredUser()?.id);

  useEffect(() => {
    function checkAuth() {
      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (token && storedUser?.id) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener(AUTH_EVENT, checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener(AUTH_EVENT, checkAuth);
    };
  }, []);

  useEffect(() => {
    async function loadHome() {
      try {
        const [heroRes, featuredRes, reviewRes] = await Promise.all([
          fetch(`${API_BASE}/home/hero`),
          fetch(`${API_BASE}/home/featured`),
          fetch(`${API_BASE}/home/reviews`, { headers: authHeader() })
        ]);

        const heroData = await heroRes.json();
        const featuredData = await featuredRes.json();
        const reviewData = await reviewRes.json();

        setHero(heroData);
        setFeaturedGames(featuredData);
        setLatestReviews(reviewData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  async function handleLoveReview(reviewId) {
    const user = getStoredUser();

    if (!user?.id) {
      alert("Please login to love reviews.");
      return;
    }

    try {
      setReviewActionKey(`love-${reviewId}`);

      const response = await fetch(`${API_BASE}/reviews/${reviewId}/love`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to update review love.");
      }

      setLatestReviews((prev) =>
        prev.map((review) =>
          Number(review.id) === Number(reviewId)
            ? {
              ...review,
              lovedByMe: Boolean(data.loved),
              loveCount: Number(data.loveCount || review.loveCount || 0),
            }
            : review
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update review love.");
    } finally {
      setReviewActionKey("");
    }
  }

  if (loading || !hero) {
    return <div className="container">Loading homepage...</div>;
  }

  return (
    <div className="container" style={{ paddingBottom: 22 }}>
      <section
        className="card"
        style={{
          marginTop: 16,
          padding: 0,
          overflow: "hidden",
          position: "relative",
          borderRadius: 18,
        }}
      >
        <div
          style={{
            height: 380,
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.15)), url(${hero.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "end",
          }}
        >
          <div style={{ padding: 18, width: "100%" }}>
            <div
              style={{
                display: "inline-flex",
                gap: 10,
                alignItems: "center",
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontWeight: 900, letterSpacing: 0.4 }}>FEATURED</span>
              <span style={{ opacity: 0.75 }}>Top rated this week</span>
              <span
                style={{
                  marginLeft: 6,
                  fontWeight: 900,
                  background: hero.accent,
                  color: "#0b0c10",
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                {hero.score}
              </span>
            </div>

            <h1
              style={{
                margin: "10px 0 6px",
                fontSize: 42,
                fontWeight: 950,
                letterSpacing: -0.6,
              }}
            >
              {hero.title}
            </h1>

            <p style={{ margin: 0, opacity: 0.85, fontSize: 16 }}>{hero.subtitle}</p>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <Link to={`/games/${hero.id}`} className="btn primary">
                View Details
              </Link>
              <Link to="/games" className="btn">
                Browse Games
              </Link>
              {!isLoggedIn && (
                <Link to="/login" className="btn">
                  Login to Review
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "18px 0 10px" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>
          Featured Games
        </h2>
        <span style={{ opacity: 0.70 }}>Premium picks</span>

        <div style={{ marginLeft: "auto" }}>
          <Link to="/games" className="btn">
            View all
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 14,
        }}
      >
        {featuredGames.map((g) => (
          <Link
            key={g.id}
            to={`/games/${g.id}`}
            className="card shadow-hover"
            style={{
              padding: 0,
              overflow: "hidden",
              borderRadius: 18,
              position: "relative",
            }}
          >
            <div
              style={{
                height: 260,
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.78)), url(${g.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: g.accent,
                  color: "#0b0c10",
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontWeight: 950,
                  letterSpacing: 0.2,
                }}
              >
                {g.score}
              </div>

              <div style={{ position: "absolute", left: 14, right: 14, bottom: 14 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 950,
                    letterSpacing: -0.3,
                  }}
                >
                  {g.title}
                </h3>
                <p style={{ margin: "6px 0 0", opacity: 0.85 }}>{g.subtitle}</p>

                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(10px)",
                      fontWeight: 700,
                    }}
                  >
                    ⭐ Top Rated
                  </span>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(10px)",
                      fontWeight: 700,
                    }}
                  >
                    🔥 Trending
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginTop: 22 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>
          Latest Reviews
        </h2>
        <span style={{ opacity: 0.70 }}>Community feedback</span>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
        {latestReviews.map((r) => (
          <div
            key={r.id}
            className="card shadow-hover"
            style={{
              display: "flex",
              gap: 14,
              alignItems: "stretch",
              padding: 14,
              border: "1px solid rgba(255,255,255,0.14)",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05))",
              boxShadow: `0 18px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -80,
                background: `radial-gradient(circle at 20% 20%, ${r.accent}33, transparent 55%)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                minWidth: 78,
                borderRadius: 16,
                background: `linear-gradient(180deg, ${r.accent}55, rgba(255,255,255,0.10))`,
                border: `1px solid ${r.accent}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 950,
                fontSize: 18,
                position: "relative",
                zIndex: 1,
              }}
            >
              {r.score}
            </div>

            <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    overflow: "hidden",
                    border: `1px solid ${r.accent}66`,
                    background: "rgba(255,255,255,0.08)",
                    boxShadow: "0 12px 26px rgba(0,0,0,0.35)",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={r.avatar}
                    alt={r.user}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

<div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
  <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>{r.user}</div>
  {renderReviewBadge(r)}
</div>

                <span style={{ opacity: 0.7, fontSize: 12 }}>{formatDate(r.date)}</span>

                <span style={{ marginLeft: "auto", opacity: 0.92, fontWeight: 900 }}>
                  {r.game}
                </span>
              </div>

              <p style={{ margin: "10px 0 0", opacity: 0.88, fontSize: 15, lineHeight: 1.65 }}>
                {r.text}
              </p>

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link to={`/games/${r.gameId}`} className="btn">
                  View Game
                </Link>

                <button
                  type="button"
                  className={`comment-thread__pill ${r.lovedByMe ? "comment-thread__pill--active" : ""}`}
                  onClick={() => handleLoveReview(r.id)}
                  disabled={!isLoggedIn || reviewActionKey === `love-${r.id}`}
                >
                  <span>{r.lovedByMe ? "♥" : "♡"}</span>
                  <span>{Number(r.loveCount || 0)}</span>
                </button>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    backdropFilter: "blur(10px)",
                    fontWeight: 800,
                    opacity: 0.92,
                  }}
                >
                  ✨ Featured
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isLoggedIn && (
        <div
          className="card"
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 18,
            background: "linear-gradient(120deg, rgba(255,45,85,0.20), rgba(255,255,255,0.06))",
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontWeight: 950, letterSpacing: -0.2 }}>
              Ready to build your profile?
            </h3>
            <p style={{ margin: "6px 0 0", opacity: 0.80 }}>
              Login to rate games and write reviews.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/register" className="btn primary">
              Create account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}