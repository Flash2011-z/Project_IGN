import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

const PLACEHOLDER =
  "https://via.placeholder.com/1400x800/111111/FFFFFF?text=Game+Cover";

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

function CoverImg({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(PLACEHOLDER)}
      style={{
        width: "100%",
        height: 380,
        objectFit: "cover",
        borderRadius: 12
      }}
    />
  );
}

export default function GameDetails() {
  const { id } = useParams();
  const gameId = safeInt(id);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGame() {
      try {
        const response = await fetch(
          `http://localhost:3000/games/${gameId}`
        );

        if (!response.ok) {
          throw new Error("Game not found");
        }

        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError("Failed to fetch game");
      } finally {
        setLoading(false);
      }
    }

    if (gameId !== null) fetchGame();
  }, [gameId]);

  const ratingFill = useMemo(() => {
    if (!game) return 0;
    return clamp((game.score / 10) * 100, 0, 100);
  }, [game]);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">{error}</div>;
  if (!game) return <div className="container">Game not found</div>;

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <Link to="/games">← Back</Link>

      <h1>{game.title}</h1>
      <p>{game.subtitle} • {game.year}</p>

      <CoverImg src={game.cover_url} alt={game.title} />

      <div style={{ marginTop: 20 }}>
        <strong>Score:</strong> {game.score}
        <div
          style={{
            height: 8,
            width: 200,
            background: "#333",
            borderRadius: 999,
            marginTop: 6
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${ratingFill}%`,
              background: game.accent_color || "#00ffcc",
              borderRadius: 999
            }}
          />
        </div>
      </div>

      <p style={{ marginTop: 20 }}>{game.description}</p>

      <div style={{ marginTop: 20 }}>
        <strong>Genres:</strong>
        <div>
          {game.genres?.map((g) => (
            <span key={g} style={{ marginRight: 8 }}>
              {g}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <strong>Platforms:</strong>
        <div>
          {game.platforms?.map((p) => (
            <span key={p} style={{ marginRight: 8 }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
