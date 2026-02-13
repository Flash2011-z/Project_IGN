import { Link } from "react-router-dom";
import { useState, useEffect } from "react";




function formatDate(iso) {
  return iso;
}

export default function Home() {
  const API_BASE = "http://localhost:3000";

const [hero, setHero] = useState(null);
const [featuredGames, setFeaturedGames] = useState([]);
const [latestReviews, setLatestReviews] = useState([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadHome() {
    try {
      const [heroRes, featuredRes, reviewRes] = await Promise.all([
        fetch(`${API_BASE}/home/hero`),
        fetch(`${API_BASE}/home/featured`),
        fetch(`${API_BASE}/home/reviews`)
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

   if (loading || !hero) {
  return <div className="container">Loading homepage...</div>;
}

  return (
    <div className="container" style={{ paddingBottom: 22 }}>
      {/* HERO (big + premium) */}
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
              <Link to="/login" className="btn">
                Login to Review
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED GRID TITLE */}
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

      {/* BIG CARDS (bigger images + premium overlays) */}
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
                height: 260, // ✅ bigger image
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.78)), url(${g.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              {/* Score badge */}
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

              {/* Bottom text overlay */}
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

     {/* LATEST REVIEWS */}
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
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          inset: -80,
          background: `radial-gradient(circle at 20% 20%, ${r.accent}33, transparent 55%)`,
          pointerEvents: "none",
        }}
      />

      {/* LEFT: score box (same as your style) */}
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

      {/* RIGHT: avatar + content */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Anime avatar */}
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

          <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>{r.user}</div>

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
      {/* PREMIUM CTA */}
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
            Login to rate games and write reviews. We’ll connect to your backend API later.
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
    </div>
  );
}