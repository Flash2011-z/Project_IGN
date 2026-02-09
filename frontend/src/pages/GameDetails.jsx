import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

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
      "A cinematic open-world western with deep characters, immersive systems, and unforgettable storytelling. Explore vast landscapes, meaningful side quests, and a living world that reacts to your choices.",
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
      "A huge sandbox experience with iconic missions, chaotic fun, and a living city that never sleeps. Switch between characters and create your own chaos.",
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
    cover: "https://images.wallpapersden.com/image/download/cyberpunk-2077-new-key-art_bGpoZm2UmZqaraWkpJRmbmdlrWZlbWU.jpg",
    accent: "#f7d000",
    description:
      "A neon-drenched RPG with build variety, stylish combat, and a dense urban world to explore. Craft your playstyle and dive into Night City’s stories.",
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
    cover: "https://images.wallpapersden.com/image/download/elden-ring-hd-gaming-2022_bWdlZm2UmZqaraWkpJRmbmdlrWZlbWU.jpg",
    accent: "#c8a43a",
    description:
      "A massive fantasy world full of mystery, tough bosses, and rewarding exploration. Discover secrets, build your character, and conquer legendary foes.",
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
    cover: "https://images.wallpapersden.com/image/download/the-witcher-3-wild-hunt_am5tbGWUmZqaraWkpJRmZWVlZa1pbmhq.jpg",
    accent: "#59a3ff",
    description:
      "A story-driven RPG with memorable quests and characters. Track monsters, make tough decisions, and explore a world full of life.",
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
    cover: "https://images.wallpapersden.com/image/download/kratos-and-atreus-in-god-of-war-ragnarok_bmdlaWuUmZqaraWkpJRobWllrWdma2U.jpg",
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
    cover: "https://images.wallpapersden.com/image/download/hades-game-2018_a2hpbGmUmZqaraWkpJRnam1lrWZpamU.jpg",
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
    cover: "https://images.wallpapersden.com/image/download/minecraft_a2VlbWeUmZqaraWkpJRoaGtlrWdmZWU.jpg",
    accent: "#2ecc71",
    description:
      "Build anything, survive nights, and create worlds—timeless sandbox freedom.",
  },
];

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

export default function GameDetails() {
  const params = useParams();
  const gameId = safeInt(params.id);

  const game = useMemo(() => {
    if (gameId === null) return null;
    for (let i = 0; i < gamesData.length; i++) {
      if (gamesData[i].id === gameId) return gamesData[i];
    }
    return null;
  }, [gameId]);

  const [reviews, setReviews] = useState(seedReviews);
  const [name, setName] = useState("");
  const [score, setScore] = useState("9.0");
  const [text, setText] = useState("");

  const gameReviews = useMemo(() => {
    if (!game) return [];
    return reviews.filter((r) => r.gameId === game.id);
  }, [reviews, game]);

  const avgScore = useMemo(() => {
    if (!game) return 0;
    if (gameReviews.length === 0) return game.score;
    let sum = 0;
    for (let i = 0; i < gameReviews.length; i++) sum += gameReviews[i].score;
    return Math.round((sum / gameReviews.length) * 10) / 10;
  }, [game, gameReviews]);

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
      {/* Top actions */}
      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Link to="/games" className="btn ghost">
          ← Back
        </Link>

        <div className="muted" style={{ fontWeight: 800 }}>
          Games / <span style={{ color: "#fff" }}>{game.title}</span>
        </div>
      </div>

      {/* Hero poster */}
      <section className="card" style={{ marginTop: 14, padding: 0, overflow: "hidden", borderRadius: 18 }}>
        <div
          className="poster"
          style={{
            height: 380,
            backgroundImage: `url(${game.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "end",
          }}
        >
          <div style={{ padding: 16, width: "100%" }}>
            <div className="glass" style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", justifyContent: "space-between" }}>
              <div>
                <div className="muted" style={{ fontWeight: 900 }}>
                  {game.subtitle} • {game.year}
                </div>
                <h1 style={{ margin: "6px 0 0", fontSize: 36, fontWeight: 950, letterSpacing: -0.7 }}>{game.title}</h1>
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
      </section>

      {/* Details */}
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14, alignItems: "start" }}>
        <div className="card">
          <h2 style={{ marginTop: 0, fontWeight: 950, letterSpacing: -0.3 }}>Overview</h2>
          <p className="text-premium" style={{ marginTop: 8 }}>
            {game.description}
          </p>

          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {game.genres.map((tag) => (
              <span
                key={tag}
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
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Game Info</h3>

          <div style={{ display: "grid", gap: 10 }}>
            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>Developer</div>
              <div style={{ fontWeight: 900 }}>{game.developer}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>Platforms</div>
              <div style={{ fontWeight: 900 }}>{game.platforms.join(", ")}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>Release Year</div>
              <div style={{ fontWeight: 900 }}>{game.year}</div>
            </div>

            <Link to="/games" className="btn primary" style={{ textAlign: "center" }}>
              Browse More
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
        <div className="card">
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontWeight: 950, letterSpacing: -0.3 }}>Reviews</h2>
            <span className="muted" style={{ fontWeight: 800 }}>({gameReviews.length})</span>
            <span style={{ marginLeft: "auto" }} className="muted">
              Avg: <b style={{ color: "#fff" }}>{avgScore}</b>/10
            </span>
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
                      <div className="muted" style={{ fontWeight: 800 }}>{r.date}</div>

                      <div style={{ marginLeft: "auto", fontWeight: 950 }}>
                        <span style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)", padding: "4px 10px", borderRadius: 999 }}>
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

        {/* Add review */}
        <div className="card">
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Add a Review (sample)</h3>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 160px" }}>
              <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="input" placeholder="Score (0-10)" value={score} onChange={(e) => setScore(e.target.value)} />
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