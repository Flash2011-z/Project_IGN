import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AUTH_EVENT,
  WISHLIST_EVENT,
  CART_EVENT,
  clearStoredUser,
  getStoredUser,
} from "../utils/auth";
import { fetchWishlistGames } from "../utils/wishlist";
import { fetchCart } from "../utils/cart";
import { getAvatarUrl } from "../utils/avatar";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getStoredUser());
  const [wishCount, setWishCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const avatarUrl = user ? getAvatarUrl(user) : null;

  useEffect(() => {
    async function refresh(nextUser = getStoredUser()) {
      setUser(nextUser);

      if (!nextUser?.id) {
        setWishCount(0);
        setCartCount(0);
        return;
      }

      try {
        const [wishedGames, cart] = await Promise.all([
          fetchWishlistGames(nextUser.id),
          fetchCart(nextUser.id),
        ]);

        setWishCount(wishedGames.length);
        setCartCount(cart.itemCount || 0);
      } catch {
        setWishCount(0);
        setCartCount(0);
      }
    }

    refresh();

    function handleAuth() {
      refresh(getStoredUser());
    }

    function handleWishlist() {
      refresh(getStoredUser());
    }

    function handleCart() {
      refresh(getStoredUser());
    }

    window.addEventListener("focus", handleWishlist);
    window.addEventListener("storage", handleAuth);
    window.addEventListener(AUTH_EVENT, handleAuth);
    window.addEventListener(WISHLIST_EVENT, handleWishlist);
    window.addEventListener(CART_EVENT, handleCart);

    return () => {
      window.removeEventListener("focus", handleWishlist);
      window.removeEventListener("storage", handleAuth);
      window.removeEventListener(AUTH_EVENT, handleAuth);
      window.removeEventListener(WISHLIST_EVENT, handleWishlist);
      window.removeEventListener(CART_EVENT, handleCart);
    };
  }, []);

  function handleLogout() {
    clearStoredUser();
    setUser(null);
    setWishCount(0);
    setCartCount(0);
    navigate("/");
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11,12,16,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="container nav-shell" style={{ display: "flex", alignItems: "center" }}>

        {/* LOGO */}
        <Link to="/" style={{ fontWeight: 900, letterSpacing: 1, fontSize: 20 }}>
          <span style={{ color: "#ff2d55" }}>IGN</span>
        </Link>

        {/* CENTER NAV */}
        <nav className="nav-links" style={{ marginLeft: 30 }}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>

          <NavLink to="/games" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Games
          </NavLink>

          <NavLink to="/shop" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Shop
          </NavLink>
        </nav>

        {/* RIGHT SIDE */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>

          <NavLink to="/wishlist" className="nav-icon">
            ❤️
            {wishCount > 0 && <span className="nav-badge">{wishCount}</span>}
          </NavLink>

          <NavLink to="/cart" className="nav-icon">
            🛒
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </NavLink>

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
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    padding: 2,
                    background: "linear-gradient(135deg, #ff2d55, #7c5cff, #00c2ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
                  }}
                >
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      background: "#111",
                    }}
                  />
                </div>

                <span style={{ fontWeight: 900, letterSpacing: 0.2 }}>
                  {user.name}
                </span>
              </Link>
              <Link to="/orders" className="btn ghost">
                Orders
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