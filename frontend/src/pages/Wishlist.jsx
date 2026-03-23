import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AUTH_EVENT, WISHLIST_EVENT, getStoredUser } from "../utils/auth";
import { fetchWishlistGames, removeWishlistGame } from "../utils/wishlist";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0b0c10"/>
        <stop offset="1" stop-color="#1f2330"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="700" fill="url(#g)"/>
    <text x="60" y="140" fill="#ffffff" font-family="Arial" font-size="72" font-weight="700" opacity="0.9">
      Game Cover
    </text>
    <text x="60" y="220" fill="#ffffff" font-family="Arial" font-size="34" opacity="0.65">
      Image unavailable — placeholder shown
    </text>
  </svg>
`);

function GameCover({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);

  useEffect(() => {
    setImgSrc(src || PLACEHOLDER);
  }, [src]);

  return (
    <div className="coverWrap">
      <img
        className="coverImg"
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgSrc(PLACEHOLDER)}
      />
      <div className="coverShade" />
    </div>
  );
}

export default function Wishlist() {
  const [user, setUser] = useState(() => getStoredUser());
  const [wishedGames, setWishedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWishlist(nextUser = getStoredUser()) {
    setUser(nextUser);

    if (!nextUser?.id) {
      setWishedGames([]);
      setLoading(false);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const games = await fetchWishlistGames(nextUser.id);
      setWishedGames(Array.isArray(games) ? games : []);
    } catch (err) {
      setError(err.message || "Failed to load wishlist.");
      setWishedGames([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();

    function handleRefresh() {
      loadWishlist(getStoredUser());
    }

    window.addEventListener("focus", handleRefresh);
    window.addEventListener("storage", handleRefresh);
    window.addEventListener(AUTH_EVENT, handleRefresh);
    window.addEventListener(WISHLIST_EVENT, handleRefresh);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("storage", handleRefresh);
      window.removeEventListener(AUTH_EVENT, handleRefresh);
      window.removeEventListener(WISHLIST_EVENT, handleRefresh);
    };
  }, []);

  async function handleRemove(gameId) {
    if (!user?.id) return;

    const previous = wishedGames;
    const next = previous.filter((g) => g.id !== gameId);
    setWishedGames(next);

    try {
      setError("");
      await removeWishlistGame(user.id, gameId);
    } catch (err) {
      setWishedGames(previous);
      setError(err.message || "Failed to remove from wishlist.");
    }
  }

  if (!user?.id) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <section className="pageHero" style={{ marginTop: 12 }}>
          <div className="pageHeroTop">
            <div>
              <div className="kicker">Collection</div>
              <h1 className="heroTitle">Wishlist</h1>
              <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
                Login to view the wishlist connected to your account.
              </p>
            </div>
          </div>
        </section>

        <div className="card" style={{ marginTop: 14 }}>
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>You are not logged in</h3>
          <p className="muted" style={{ margin: "6px 0 12px" }}>
            Sign in first. Each user has a separate wishlist.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/login" className="btn primary">Login</Link>
            <Link to="/register" className="btn ghost">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: 28 }}>
      <section className="pageHero" style={{ marginTop: 12 }}>
        <div className="pageHeroTop">
          <div>
            <div className="kicker">Collection</div>
            <h1 className="heroTitle">Wishlist</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Your wishlist is now tied to your logged-in profile.
            </p>
          </div>

          <div className="heroBtns">
            <Link to="/games" className="btn ghost">
              Back to Games
            </Link>
            <Link to="/profile" className="btn subtle">
              Profile
            </Link>
          </div>
        </div>

        <div className="pillRow">
          <span className="pill soft">{wishedGames.length} games</span>
          <span className="pill">User: {user.name}</span>
        </div>
      </section>

      {loading ? (
        <div className="card" style={{ marginTop: 14 }}>
          Loading wishlist...
        </div>
      ) : error ? (
        <div className="card" style={{ marginTop: 14 }}>
          {error}
        </div>
      ) : wishedGames.length === 0 ? (
        <div className="card" style={{ marginTop: 14 }}>
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Your wishlist is empty</h3>
          <p className="muted" style={{ margin: "6px 0 12px" }}>
            Go to the Games page and tap the heart button on any game.
          </p>
          <Link to="/games" className="btn primary">
            Browse Games
          </Link>
        </div>
      ) : (
        <section className="gamesGrid" style={{ marginTop: 14 }}>
          {wishedGames.map((g) => (
            <div key={g.id} className="card shadow-hover gameCard" style={{ padding: 0, overflow: "hidden" }}>
              <GameCover src={g.cover} alt={g.title} />

              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 950, letterSpacing: -0.3 }}>{g.title}</h3>

                  <span
                    style={{
                      marginLeft: "auto",
                      fontWeight: 950,
                      background: g.accent,
                      color: "#0b0c10",
                      padding: "4px 10px",
                      borderRadius: 999,
                      minWidth: 54,
                      textAlign: "center",
                    }}
                  >
                    {g.score}
                  </span>
                </div>

                <p className="muted" style={{ margin: "6px 0 10px" }}>
                  {g.subtitle} • {g.year}
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {(g.genres || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link to={`/games/${g.id}`} className="btn primary sm">
                    View Details
                  </Link>
                  <button type="button" className="btn subtle sm" onClick={() => handleRemove(g.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}