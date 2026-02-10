import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function readUser() {
  try {
    const raw = localStorage.getItem("ign_user");
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object") return obj;
    return null;
  } catch {
    return null;
  }
}

function readWishlistCount() {
  try {
    const raw = localStorage.getItem("ign_wishlist");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => readUser());
  const [wishCount, setWishCount] = useState(() => readWishlistCount());

  useEffect(() => {
    function refresh() {
      setUser(readUser());
      setWishCount(readWishlistCount());
    }

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem("ign_user");
    } catch {}
    setUser(null);
    navigate("/");
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11,12,16,0.75)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          gap: 14,
          alignItems: "center",
          padding: "14px 16px",
        }}
      >
        <Link to="/" style={{ fontWeight: 900, letterSpacing: 0.8 }}>
          <span style={{ color: "#ff2d55" }}>IGN</span>
        </Link>

        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>

          <NavLink to="/games" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Games
          </NavLink>

          <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Wishlist{wishCount > 0 ? <span className="wishCount">{wishCount}</span> : null}
          </NavLink>

          {/* If logged in, show Profile link in nav too (optional but nice) */}
          {user ? (
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Profile
            </NavLink>
          ) : null}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <input className="input" placeholder="Search games..." style={{ width: 260 }} />

          {!user ? (
            <>
              <Link to="/login" className="btn">
                Login
              </Link>
              <Link to="/register" className="btn primary">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn">
                {user.name ? user.name : "Profile"}
              </Link>
              <button type="button" className="btn primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}