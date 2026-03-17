import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AUTH_EVENT,
  WISHLIST_EVENT,
  clearStoredUser,
  getStoredUser,
} from "../utils/auth";
import { fetchWishlistGames } from "../utils/wishlist";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getStoredUser());
  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    async function refresh(nextUser = getStoredUser()) {
      setUser(nextUser);

      if (!nextUser?.id) {
        setWishCount(0);
        return;
      }

      try {
        const wishedGames = await fetchWishlistGames(nextUser.id);
        setWishCount(wishedGames.length);
      } catch {
        setWishCount(0);
      }
    }

    refresh();

    function handleAuth() {
      refresh(getStoredUser());
    }

    function handleWishlist() {
      refresh(getStoredUser());
    }

    window.addEventListener("focus", handleWishlist);
    window.addEventListener("storage", handleAuth);
    window.addEventListener(AUTH_EVENT, handleAuth);
    window.addEventListener(WISHLIST_EVENT, handleWishlist);

    return () => {
      window.removeEventListener("focus", handleWishlist);
      window.removeEventListener("storage", handleAuth);
      window.removeEventListener(AUTH_EVENT, handleAuth);
      window.removeEventListener(WISHLIST_EVENT, handleWishlist);
    };
  }, []);

  function handleLogout() {
    clearStoredUser();
    setUser(null);
    setWishCount(0);
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
      <div className="container nav-shell">
        <Link to="/" style={{ fontWeight: 900, letterSpacing: 0.8, fontSize: 18 }}>
          <span style={{ color: "#ff2d55" }}>IGN</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>

          <NavLink to="/games" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Games
          </NavLink>

          <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Wishlist{wishCount > 0 ? <span className="wishCount">{wishCount}</span> : null}
          </NavLink>

          {user ? (
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Profile
            </NavLink>
          ) : null}
        </nav>

        <div className="nav-actions">
          <input className="input nav-search" placeholder="Search games..." />

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
              <Link to="/profile" className="btn nav-profile-btn" title={user.email || user.name || "Profile"}>
                <span className="nav-profile-dot" aria-hidden="true">
                  {(user.name || "P").charAt(0).toUpperCase()}
                </span>
                <span className="nav-profile-name">{user.name || "Profile"}</span>
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