import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

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

function safeParseArray(raw) {
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) return v;
    return [];
  } catch {
    return [];
  }
}

function loadWishlistIds() {
  const raw = localStorage.getItem("ign_wishlist");
  const arr = safeParseArray(raw);
  // ensure numbers (ids in your gamesData are numbers)
  return arr
    .map((x) => parseInt(String(x), 10))
    .filter((n) => !Number.isNaN(n));
}

function GameCover({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);

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

export default function Wishlist({ gamesData = [] }) {
  const [wishlistIds, setWishlistIds] = useState(() => loadWishlistIds());

  // keep page updated if user toggles wishlist elsewhere (Games page)
  useEffect(() => {
    function onStorage(e) {
      if (e && e.key && e.key !== "ign_wishlist") return;
      setWishlistIds(loadWishlistIds());
    }
    window.addEventListener("storage", onStorage);

    // also refresh when the page becomes visible again
    function onFocus() {
      setWishlistIds(loadWishlistIds());
    }
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const wishedGames = useMemo(() => {
    const map = {};
    for (let i = 0; i < wishlistIds.length; i++) map[wishlistIds[i]] = true;

    const list = [];
    for (let i = 0; i < gamesData.length; i++) {
      const g = gamesData[i];
      if (map[g.id]) list.push(g);
    }
    return list;
  }, [wishlistIds, gamesData]);

  function removeFromWishlist(id) {
    const next = wishlistIds.filter((x) => x !== id);
    setWishlistIds(next);
    try {
      localStorage.setItem("ign_wishlist", JSON.stringify(next));
    } catch {}
  }

  return (
    <div className="container" style={{ paddingBottom: 28 }}>
      <section className="pageHero" style={{ marginTop: 12 }}>
        <div className="pageHeroTop">
          <div>
            <div className="kicker">Collection</div>
            <h1 className="heroTitle">Wishlist</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Saved locally (for now). Your favorite games stay here even after refresh.
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
          <span className="pill">Local save</span>
        </div>
      </section>

      {wishedGames.length === 0 ? (
        <div className="card" style={{ marginTop: 14 }}>
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Your wishlist is empty</h3>
          <p className="muted" style={{ margin: "6px 0 12px" }}>
            Go to the Games page and tap the ♡ button on any cover.
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
                  {g.genres.slice(0, 3).map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link to={`/games/${g.id}`} className="btn primary sm">
                    View Details
                  </Link>
                  <button type="button" className="btn subtle sm" onClick={() => removeFromWishlist(g.id)}>
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