import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";


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


function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^a-z0-9\s\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(q) {
  const s = normalize(q);
  if (!s) return [];
  return s.split(" ").filter(Boolean);
}

function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

function buildSearchFields(game) {
  const title = normalize(game.title);
  const subtitle = normalize(game.subtitle);
  const dev = normalize(game.developer);
  const genres = normalize((game.genres || []).join(" "));
  const platforms = normalize((game.platforms || []).join(" "));
  const year = String(game.year || "");
  return {
    title,
    subtitle,
    dev,
    genres,
    platforms,
    year,
    all: normalize(
      game.title +
      " " +
      game.subtitle +
      " " +
      game.developer +
      " " +
      (game.genres || []).join(" ") +
      " " +
      (game.platforms || []).join(" ") +
      " " +
      String(game.year || "")
    ),
  };
}

function relevanceScore(game, tokens) {
  if (!tokens || tokens.length === 0) return 0;

  const f = buildSearchFields(game);
  let score = 0;
  let hits = 0;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (f.all.indexOf(t) === -1) continue;

    hits += 1;

    if (f.title.indexOf(t) !== -1) score += 12;
    else if (f.subtitle.indexOf(t) !== -1) score += 8;
    else if (f.genres.indexOf(t) !== -1) score += 7;
    else if (f.dev.indexOf(t) !== -1) score += 6;
    else if (f.platforms.indexOf(t) !== -1) score += 4;
    else if (f.year.indexOf(t) !== -1) score += 3;
    else score += 2;
  }

  if (hits > 0) score += hits * 2;

  const phrase = tokens.join(" ");
  if (phrase.length >= 4 && f.all.indexOf(phrase) !== -1) score += 6;

  return score;
}

function stableSort(list, cmp) {
  const indexed = list.map((item, idx) => ({ item, idx }));
  indexed.sort((a, b) => {
    const c = cmp(a.item, b.item);
    if (c !== 0) return c;
    return a.idx - b.idx;
  });
  return indexed.map((x) => x.item);
}

function GameCover({ src, alt, onToggleWish, wished }) {
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

      <button
        type="button"
        className={"wishBtn " + (wished ? "active" : "")}
        onClick={onToggleWish}
        title={wished ? "Remove from wishlist" : "Add to wishlist"}
      >
        {wished ? "♥" : "♡"}
      </button>
    </div>
  );
}

export default function Games() {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  // ✅ only changed these defaults:
  const [genre, setGenre] = useState("All Genres");
  const [platform, setPlatform] = useState("All Platforms");

  const [minScore, setMinScore] = useState(8.0);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem("ign_wishlist");
      const arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) return arr;
      return [];
    } catch {
      return [];
    }
  });

  const [wishOnly, setWishOnly] = useState(false);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch("http://localhost:3000/games");
        const data = await response.json();
        setGamesData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch games");
        setLoading(false);
      }
    }

    fetchGames();
  }, []);


  function saveWishlist(next) {
    setWishlist(next);
    try {
      localStorage.setItem("ign_wishlist", JSON.stringify(next));
    } catch { }
  }

  function toggleWish(id) {
    const exists = wishlist.indexOf(id) !== -1;
    if (exists) saveWishlist(wishlist.filter((x) => x !== id));
    else saveWishlist([id].concat(wishlist));
  }

  const tokens = useMemo(() => tokenize(search), [search]);
  const searching = tokens.length > 0;

  // ✅ only changed these two memos (reliable Set + better labels)
  const allGenres = useMemo(() => {
    const set = new Set();
    for (let i = 0; i < gamesData.length; i++) {
      const arr = Array.isArray(gamesData[i].genres) ? gamesData[i].genres : [];
      for (let j = 0; j < arr.length; j++) set.add(arr[j]);
    }
    return ["All Genres", ...Array.from(set).sort()];
  }, [gamesData]);

  const allPlatforms = useMemo(() => {
    const set = new Set();
    for (let i = 0; i < gamesData.length; i++) {
      const arr = Array.isArray(gamesData[i].platforms) ? gamesData[i].platforms : [];
      for (let j = 0; j < arr.length; j++) set.add(arr[j]);
    }
    return ["All Platforms", ...Array.from(set).sort()];
  }, [gamesData]);

  const filtered = useMemo(() => {
    let list = gamesData.slice(0);

    if (wishOnly) list = list.filter((g) => wishlist.indexOf(g.id) !== -1);

    // ✅ only changed these comparisons:
    if (genre !== "All Genres") list = list.filter((g) => (g.genres || []).indexOf(genre) !== -1);
    if (platform !== "All Platforms") list = list.filter((g) => (g.platforms || []).indexOf(platform) !== -1);

    const ms = clamp(parseFloat(minScore), 0, 10);
    list = list.filter((g) => g.score >= ms);

    if (tokens.length > 0) {
      list = list
        .map((g) => ({ g, rel: relevanceScore(g, tokens) }))
        .filter((x) => x.rel > 0)
        .map((x) => x.g);

      return stableSort(list, (a, b) => {
        const ra = relevanceScore(a, tokens);
        const rb = relevanceScore(b, tokens);
        if (rb !== ra) return rb - ra;
        if (b.score !== a.score) return b.score - a.score;
        if (b.year !== a.year) return b.year - a.year;
        return a.title.localeCompare(b.title);
      });
    }

    return stableSort(list, (a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.year !== a.year) return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
  }, [genre, platform, minScore, tokens, wishOnly, wishlist]);

  function clearAll() {
    setSearch("");

    // ✅ only changed these resets:
    setGenre("All Genres");
    setPlatform("All Platforms");

    setMinScore(8.0);
    setWishOnly(false);
  }
  if (loading) {
    return <div className="container">Loading games...</div>;
  }

  if (error) {
    return <div className="container">{error}</div>;
  }

  return (
    <div className="container" style={{ paddingBottom: 28 }}>
      <section className="pageHero">
        <div className="pageHeroTop">
          <div>
            <div className="kicker">Library</div>
            <h1 className="heroTitle">Browse Games</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Premium filters + relevance search. Wishlist is saved locally for now.
            </p>
          </div>

          <div className="heroBtns">
            <Link to="/" className="btn ghost">
              Back to Home
            </Link>

            <button
              type="button"
              className={"btn subtle " + (wishOnly ? "activePillBtn" : "")}
              onClick={() => setWishOnly(!wishOnly)}
              title="Show only wishlist"
            >
              Wishlist <span className="wishCount">{wishlist.length}</span>
            </button>

            <button type="button" className="btn subtle" onClick={clearAll}>
              Reset
            </button>
          </div>
        </div>

        <div className="pillRow">
          <span className="pill soft">
            {searching ? `${filtered.length} results` : `${filtered.length} games`}
          </span>
          {wishOnly ? <span className="pill">Wishlist only</span> : null}

          {/* ✅ only changed these checks */}
          {genre !== "All Genres" ? <span className="pill">Genre: {genre}</span> : null}
          {platform !== "All Platforms" ? <span className="pill">Platform: {platform}</span> : null}

          <span className="pill">Min score: {minScore.toFixed(1)}</span>
        </div>
      </section>

      <section className="card filterBar" style={{ marginTop: 14 }}>
        <div className="searchWrap">
          <span className="searchIcon">⌕</span>
          <input
            className="input searchInput"
            placeholder='Search: "rockstar", "open world", "rpg 2020", "ps action"...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search ? (
            <button type="button" className="clearX" onClick={() => setSearch("")} title="Clear">
              ✕
            </button>
          ) : null}
        </div>

        <select className="input" value={genre} onChange={(e) => setGenre(e.target.value)}>
          {allGenres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select className="input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {allPlatforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <div className="rangeInline">
          <div className="rangeLabel">
            Min score: <span className="rangeValue">{minScore.toFixed(1)}</span>
          </div>
          <input
            className="rangeInput"
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={minScore}
            onChange={(e) => setMinScore(parseFloat(e.target.value))}
          />
        </div>

        <div className="muted" style={{ gridColumn: "1 / -1", fontWeight: 800 }}>
          {searching ? (
            <>
              Ranked by <span style={{ color: "#fff" }}>relevance</span>
            </>
          ) : (
            <>
              Ranked by <span style={{ color: "#fff" }}>score</span>
            </>
          )}
        </div>
      </section>


      <section className="gamesGrid" style={{ marginTop: 14 }}>
        {filtered.map((g) => {
          const wished = wishlist.indexOf(g.id) !== -1;

          return (
            <div key={g.id} className="card shadow-hover gameCard" style={{ padding: 0, overflow: "hidden" }}>
              <GameCover
                src={g.cover}
                alt={g.title}
                wished={wished}
                onToggleWish={() => toggleWish(g.id)}
              />

              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 950, letterSpacing: -0.3 }}>
                    {g.title}
                  </h3>

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

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                  {g.genres.slice(0, 3).map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link to={`/games/${g.id}`} className="btn primary sm">
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {filtered.length === 0 ? (
        <div className="card" style={{ marginTop: 14 }}>
          <h3 style={{ marginTop: 0 }}>No games found</h3>
          <p className="muted" style={{ marginBottom: 0 }}>
            Try fewer keywords, reset filters, or lower min score.
          </p>
        </div>
      ) : null}
    </div>
  );
}