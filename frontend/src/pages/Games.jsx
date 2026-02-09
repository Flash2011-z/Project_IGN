import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

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

const gamesData = [
  {
    id: 1,
    title: "Red Dead Redemption 2",
    subtitle: "Open-world • Story • Western",
    score: 9.6,
    year: 2018,
    genres: ["Open World", "Action", "Adventure"],
    platforms: ["PC", "PS", "Xbox"],
    developer: "Rockstar Games",
    cover: "https://images.hdqwalls.com/download/red-dead-redemption-2-takes-over-dh-1920x1080.jpg",
    accent: "#ff2d55",
    description:
      "A cinematic open-world western with deep characters, immersive systems, and unforgettable storytelling.",
  },
  {
    id: 2,
    title: "Grand Theft Auto V",
    subtitle: "Open-world • Action • Crime",
    score: 9.2,
    year: 2013,
    genres: ["Open World", "Action"],
    platforms: ["PC", "PS", "Xbox"],
    developer: "Rockstar Games",
    cover: "https://images7.alphacoders.com/587/587535.jpg",
    accent: "#35d07f",
    description:
      "A huge sandbox experience with iconic missions, chaotic fun, and a living city that never sleeps.",
  },
  {
    id: 3,
    title: "Cyberpunk 2077",
    subtitle: "RPG • Action • Night City",
    score: 8.8,
    year: 2020,
    genres: ["RPG", "Action"],
    platforms: ["PC", "PS", "Xbox"],
    developer: "CD PROJEKT RED",
    cover:
      "https://images.wallpapersden.com/image/download/cyberpunk-2077-new-key-art_bGpoZm2UmZqaraWkpJRmbmdlrWZlbWU.jpg",
    accent: "#f7d000",
    description:
      "A neon-drenched RPG with build variety, stylish combat, and a dense urban world to explore.",
  },
  {
    id: 4,
    title: "Elden Ring",
    subtitle: "Souls-like • Open-world • Fantasy",
    score: 9.5,
    year: 2022,
    genres: ["RPG", "Action", "Open World"],
    platforms: ["PC", "PS", "Xbox"],
    developer: "FromSoftware",
    cover:
      "https://images.wallpapersden.com/image/download/elden-ring-hd-gaming-2022_bWdlZm2UmZqaraWkpJRmbmdlrWZlbWU.jpg",
    accent: "#c8a43a",
    description:
      "A massive fantasy world full of mystery, tough bosses, and rewarding exploration.",
  },
  {
    id: 5,
    title: "The Witcher 3: Wild Hunt",
    subtitle: "RPG • Story • Monster hunting",
    score: 9.4,
    year: 2015,
    genres: ["RPG", "Adventure"],
    platforms: ["PC", "PS", "Xbox", "Switch"],
    developer: "CD PROJEKT RED",
    cover:
      "https://images.wallpapersden.com/image/download/the-witcher-3-wild-hunt_am5tbGWUmZqaraWkpJRmZWVlZa1pbmhq.jpg",
    accent: "#59a3ff",
    description:
      "One of the best story-driven RPGs ever made—quests, characters, and worldbuilding at the top.",
  },
  {
    id: 6,
    title: "God of War",
    subtitle: "Action • Mythology • Narrative",
    score: 9.1,
    year: 2018,
    genres: ["Action", "Adventure"],
    platforms: ["PC", "PS"],
    developer: "Santa Monica Studio",
    cover:
      "https://images.wallpapersden.com/image/download/poster-of-kratos-god-of-war-ragnaroek_bW5qaWeUmZqaraWkpJRmbmdlrWZrZWU.jpg",
    accent: "#ff7a18",
    description:
      "A powerful mythic journey with cinematic combat and one of the strongest narratives in modern games.",
  },
  {
    id: 7,
    title: "Hades",
    subtitle: "Roguelike • Fast combat • Indie",
    score: 9.0,
    year: 2020,
    genres: ["Roguelike", "Action"],
    platforms: ["PC", "PS", "Xbox", "Switch"],
    developer: "Supergiant Games",
    cover:
      "https://images.wallpapersden.com/image/download/hades-game-2018_a2hpbGmUmZqaraWkpJRnam1lrWZpamU.jpg",
    accent: "#ff3b30",
    description:
      "Fast, satisfying roguelike combat with amazing voice acting and replay value.",
  },
  {
    id: 8,
    title: "Minecraft",
    subtitle: "Sandbox • Creativity • Survival",
    score: 8.9,
    year: 2011,
    genres: ["Sandbox", "Survival"],
    platforms: ["PC", "Mobile", "Console"],
    developer: "Mojang",
    cover:
      "https://images.wallpapersden.com/image/download/minecraft_a2VlbWeUmZqaraWkpJRoaGtlrWdmZWU.jpg",
    accent: "#2ecc71",
    description:
      "Build anything, survive nights, and create worlds—timeless sandbox freedom.",
  },
];

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

  function saveWishlist(next) {
    setWishlist(next);
    try {
      localStorage.setItem("ign_wishlist", JSON.stringify(next));
    } catch {}
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
  }, []);

  const allPlatforms = useMemo(() => {
    const set = new Set();
    for (let i = 0; i < gamesData.length; i++) {
      const arr = Array.isArray(gamesData[i].platforms) ? gamesData[i].platforms : [];
      for (let j = 0; j < arr.length; j++) set.add(arr[j]);
    }
    return ["All Platforms", ...Array.from(set).sort()];
  }, []);

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