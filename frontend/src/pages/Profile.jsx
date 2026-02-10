import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function safeString(v) {
  return String(v || "").trim();
}

function loadProfile() {
  try {
    const raw = localStorage.getItem("ign_profile");
    const obj = raw ? JSON.parse(raw) : null;
    if (!obj || typeof obj !== "object") return { username: "Guest", bio: "" };
    return {
      username: safeString(obj.username) || "Guest",
      bio: safeString(obj.bio),
    };
  } catch {
    return { username: "Guest", bio: "" };
  }
}

function saveProfile(p) {
  try {
    localStorage.setItem("ign_profile", JSON.stringify(p));
  } catch {}
}

function loadWishlistCount() {
  try {
    const raw = localStorage.getItem("ign_wishlist");
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return 0;
    return arr.length;
  } catch {
    return 0;
  }
}

export default function Profile() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);

  const wishlistCount = useMemo(() => loadWishlistCount(), []);

  useEffect(() => {
    // refresh wishlist count when profile page gains focus
    function onFocus() {
      // force re-render via state copy (simple + safe)
      setProfile(loadProfile());
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  function handleSave(e) {
    e.preventDefault();

    const next = {
      username: safeString(username) || "Guest",
      bio: safeString(bio),
    };

    setProfile(next);
    saveProfile(next);
  }

  function handleReset() {
    const next = { username: "Guest", bio: "" };
    setProfile(next);
    setUsername(next.username);
    setBio(next.bio);
    saveProfile(next);
  }

  return (
    <div className="container" style={{ paddingBottom: 28 }}>
      <section className="pageHero" style={{ marginTop: 12 }}>
        <div className="pageHeroTop">
          <div>
            <div className="kicker">Account</div>
            <h1 className="heroTitle">Profile</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Local profile for now (no login). Later you can connect this with your database.
            </p>
          </div>

          <div className="heroBtns">
            <Link to="/games" className="btn ghost">
              Back to Games
            </Link>
            <Link to="/wishlist" className="btn subtle">
              Wishlist
            </Link>
          </div>
        </div>

        <div className="pillRow">
          <span className="pill soft">User: {profile.username}</span>
          <span className="pill">Wishlist: {wishlistCount}</span>
          <span className="pill">Local save</span>
        </div>
      </section>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: 14, alignItems: "start" }}>
        {/* Edit card */}
        <div className="card">
          <h2 style={{ marginTop: 0, fontWeight: 950, letterSpacing: -0.3 }}>Edit Profile</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            This is just a clean UI layer. We’ll hook it to your `users` table later.
          </p>

          <form onSubmit={handleSave} style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <div className="muted" style={{ fontWeight: 900 }}>
                Username
              </div>
              <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your name" />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <div className="muted" style={{ fontWeight: 900 }}>
                Bio
              </div>
              <textarea
                className="input"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something short…"
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="submit" className="btn primary">
                Save
              </button>
              <button type="button" className="btn subtle" onClick={handleReset}>
                Reset
              </button>
            </div>

            <div className="muted" style={{ fontWeight: 700 }}>
              Tip: Later, replace localStorage with API calls (create user, update user, etc.).
            </div>
          </form>
        </div>

        {/* Stats card */}
        <div className="card">
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Stats</h3>

          <div style={{ display: "grid", gap: 10 }}>
            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>
                Username
              </div>
              <div style={{ fontWeight: 900 }}>{profile.username}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>
                Wishlist items
              </div>
              <div style={{ fontWeight: 900 }}>{wishlistCount}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>
                Account type
              </div>
              <div style={{ fontWeight: 900 }}>Guest (local)</div>
            </div>

            <Link to="/wishlist" className="btn primary" style={{ textAlign: "center" }}>
              Open Wishlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}