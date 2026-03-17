import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AUTH_EVENT, WISHLIST_EVENT, getStoredUser, setStoredUser } from "../utils/auth";
import { fetchWishlistGames } from "../utils/wishlist";

function formatJoinDate(value) {
  if (!value) return "Just joined";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Just joined";

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Profile() {
  const API_BASE = "http://localhost:3000";

  const [user, setUser] = useState(() => getStoredUser());
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function refreshLocalUser() {
      setUser(getStoredUser());
    }

    async function loadProfile() {
      const stored = getStoredUser();
      refreshLocalUser();

      if (!stored?.id) {
        setWishlistCount(0);
        setLoading(false);
        return;
      }

      try {
        const [profileResult, wishlistResult] = await Promise.allSettled([
          fetch(`${API_BASE}/profile/${stored.id}`),
          fetchWishlistGames(stored.id),
        ]);

        if (profileResult.status === "fulfilled" && profileResult.value.ok) {
          const data = await profileResult.value.json();

          if (data?.user) {
            const nextUser = setStoredUser(data.user);
            setUser(nextUser);
          }
        }

        if (wishlistResult.status === "fulfilled" && Array.isArray(wishlistResult.value)) {
          setWishlistCount(wishlistResult.value.length);
        } else {
          setWishlistCount(0);
        }
      } catch {
        setWishlistCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();

    window.addEventListener("focus", loadProfile);
    window.addEventListener("storage", refreshLocalUser);
    window.addEventListener(AUTH_EVENT, loadProfile);
    window.addEventListener(WISHLIST_EVENT, loadProfile);

    return () => {
      window.removeEventListener("focus", loadProfile);
      window.removeEventListener("storage", refreshLocalUser);
      window.removeEventListener(AUTH_EVENT, loadProfile);
      window.removeEventListener(WISHLIST_EVENT, loadProfile);
    };
  }, []);

  if (!user) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <section className="pageHero" style={{ marginTop: 12 }}>
          <div className="pageHeroTop">
            <div>
              <div className="kicker">Account</div>
              <h1 className="heroTitle">Profile</h1>
              <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
                Sign in to view your profile.
              </p>
            </div>
          </div>
        </section>

        <div className="card" style={{ marginTop: 14, padding: 24 }}>
          <h2 style={{ marginTop: 0, fontWeight: 950 }}>You are not logged in</h2>
          <p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
            Login or create an account to see your profile details.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
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
            <div className="kicker">Account</div>
            <h1 className="heroTitle">Profile</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Your account information from the current logged-in user.
            </p>
          </div>

          <div className="heroBtns">
            <Link to="/games" className="btn ghost">Back to Games</Link>
            <Link to="/wishlist" className="btn subtle">Wishlist</Link>
          </div>
        </div>

        <div className="pillRow">
          <span className="pill soft">User: {user.name}</span>
          <span className="pill">Wishlist: {wishlistCount}</span>
          <span className="pill">Joined: {formatJoinDate(user.join_date)}</span>
        </div>
      </section>

      <div className="profile-grid">
        <div className="card">
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <div className="profile-avatar">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 style={{ margin: 0, fontWeight: 950, letterSpacing: -0.3 }}>
                {user.name}
              </h2>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                {user.email}
              </p>
            </div>
          </div>

          <p className="muted" style={{ marginTop: 6, lineHeight: 1.6 }}>
            Username is controlled by your account data and cannot be changed from this page.
          </p>

          {loading ? (
            <div style={{ marginTop: 14, fontWeight: 800 }}>Loading profile...</div>
          ) : null}

          <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
            <div>
              <div className="muted" style={{ fontWeight: 900, marginBottom: 8 }}>
                Username
              </div>
              <input className="input" value={user.name || ""} readOnly />
            </div>

            <div>
              <div className="muted" style={{ fontWeight: 900, marginBottom: 8 }}>
                Email
              </div>
              <input className="input" value={user.email || ""} readOnly />
            </div>

            <div>
              <div className="muted" style={{ fontWeight: 900, marginBottom: 8 }}>
                Join Date
              </div>
              <input className="input" value={formatJoinDate(user.join_date)} readOnly />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Stats</h3>

          <div style={{ display: "grid", gap: 10 }}>
            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>Username</div>
              <div style={{ fontWeight: 900 }}>{user.name}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>Wishlist items</div>
              <div style={{ fontWeight: 900 }}>{wishlistCount}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>Account type</div>
              <div style={{ fontWeight: 900 }}>Signed in</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900 }}>Email</div>
              <div style={{ fontWeight: 900 }}>{user.email}</div>
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