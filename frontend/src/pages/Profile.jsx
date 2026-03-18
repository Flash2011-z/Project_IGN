import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AUTH_EVENT, WISHLIST_EVENT, getStoredUser, setStoredUser } from "../utils/auth";
import { fetchWishlistGames } from "../utils/wishlist";
import { fetchCart } from "../utils/cart";
import { fetchOrders } from "../utils/orders";
import { getAvatarUrl } from "../utils/avatar";

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
  const [cartCount, setCartCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
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
        setCartCount(0);
        setOrdersCount(0);
        setLoading(false);
        return;
      }

      try {
        const [profileResult, wishlistResult, cartResult, ordersResult] = await Promise.allSettled([
          fetch(`${API_BASE}/profile/${stored.id}`),
          fetchWishlistGames(stored.id),
          fetchCart(stored.id),
          fetchOrders(stored.id),
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

        if (cartResult.status === "fulfilled" && cartResult.value) {
          setCartCount(Number(cartResult.value.itemCount || 0));
        } else {
          setCartCount(0);
        }

        if (ordersResult.status === "fulfilled" && Array.isArray(ordersResult.value)) {
          setOrdersCount(ordersResult.value.length);
        } else {
          setOrdersCount(0);
        }
      } catch {
        setWishlistCount(0);
        setCartCount(0);
        setOrdersCount(0);
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
                Sign in to access your dashboard, order history, and saved games.
              </p>
            </div>
          </div>
        </section>

        <div className="card" style={{ marginTop: 14, padding: 24 }}>
          <h2 style={{ marginTop: 0, fontWeight: 950 }}>You are not logged in</h2>
          <p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
            Login or create an account to unlock your personal dashboard.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <Link to="/login" className="btn primary">Login</Link>
            <Link to="/register" className="btn ghost">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = getAvatarUrl(user);
  const bio =
    user.bio ||
    "Curating a personal collection of favorites, reviews, and upcoming purchases.";

  return (
    <div className="container" style={{ paddingBottom: 28 }}>
      <section
        className="card"
        style={{
          marginTop: 14,
          overflow: "hidden",
          position: "relative",
          padding: 0,
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at top left, rgba(255,45,85,0.18), transparent 30%), linear-gradient(135deg, rgba(255,45,85,0.16), rgba(124,92,255,0.10) 45%, rgba(11,12,16,0.45))",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: "50%",
                  padding: 4,
                  background: "linear-gradient(135deg, #ff2d55, #7c5cff, #00c2ff)",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src={avatarUrl}
                  alt={user.name || "User avatar"}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    background: "#111",
                    border: "2px solid rgba(255,255,255,0.16)",
                  }}
                />
              </div>

              <div>
                <div className="kicker">Account Center</div>
                <h1 style={{ margin: "6px 0 0", fontSize: 34, fontWeight: 950, letterSpacing: -0.6 }}>
                  {user.name}
                </h1>
                <p className="muted" style={{ margin: "8px 0 0" }}>
                  {user.email}
                </p>

                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="pill soft">Member since {formatJoinDate(user.join_date)}</span>
                  <span
                    className="pill"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,45,85,0.20), rgba(124,92,255,0.18))",
                      border: "1px solid rgba(255,255,255,0.16)",
                    }}
                  >
                    Premium Style
                  </span>
                </div>

                <p
                  style={{
                    margin: "14px 0 0",
                    maxWidth: 620,
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.84)",
                  }}
                >
                  {bio}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/shop" className="btn primary">Continue Shopping</Link>
              <Link to="/orders" className="btn ghost">View Orders</Link>
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}
      >
        <div className="card shadow-hover">
          <div className="kicker">Saved</div>
          <h3 style={{ margin: "6px 0 0", fontWeight: 950, fontSize: 30 }}>{wishlistCount}</h3>
          <p className="muted" style={{ marginBottom: 0 }}>Wishlist games</p>
        </div>

        <div className="card shadow-hover">
          <div className="kicker">Cart</div>
          <h3 style={{ margin: "6px 0 0", fontWeight: 950, fontSize: 30 }}>{cartCount}</h3>
          <p className="muted" style={{ marginBottom: 0 }}>Items ready to buy</p>
        </div>

        <div className="card shadow-hover">
          <div className="kicker">Orders</div>
          <h3 style={{ margin: "6px 0 0", fontWeight: 950, fontSize: 30 }}>{ordersCount}</h3>
          <p className="muted" style={{ marginBottom: 0 }}>Completed purchases</p>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <div className="card">
          <h2 style={{ marginTop: 0, fontWeight: 950 }}>Quick Access</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 12,
            }}
          >
            <Link
              to="/wishlist"
              className="card shadow-hover"
              style={{ textDecoration: "none", color: "inherit", margin: 0 }}
            >
              <div className="kicker">Library</div>
              <h3 style={{ marginTop: 6, fontWeight: 950 }}>Wishlist</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Review your saved titles and favorites.
              </p>
            </Link>

            <Link
              to="/cart"
              className="card shadow-hover"
              style={{ textDecoration: "none", color: "inherit", margin: 0 }}
            >
              <div className="kicker">Store</div>
              <h3 style={{ marginTop: 6, fontWeight: 950 }}>Cart</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Open your cart and continue checkout.
              </p>
            </Link>

            <Link
              to="/orders"
              className="card shadow-hover"
              style={{ textDecoration: "none", color: "inherit", margin: 0 }}
            >
              <div className="kicker">History</div>
              <h3 style={{ marginTop: 6, fontWeight: 950 }}>Orders</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                See your purchase history and receipts.
              </p>
            </Link>

            <Link
              to="/shop"
              className="card shadow-hover"
              style={{ textDecoration: "none", color: "inherit", margin: 0 }}
            >
              <div className="kicker">Explore</div>
              <h3 style={{ marginTop: 6, fontWeight: 950 }}>Shop</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Discover new listings and featured releases.
              </p>
            </Link>
          </div>
        </div>

        <div className="card" style={{ position: "sticky", top: 12 }}>
          <h3 style={{ marginTop: 0, fontWeight: 950 }}>Account Snapshot</h3>

          {loading ? (
            <div className="glass" style={{ padding: 12, marginBottom: 12 }}>
              Loading profile...
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 12 }}>
            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900, marginBottom: 6 }}>Email</div>
              <div style={{ fontWeight: 900, wordBreak: "break-word" }}>{user.email || "—"}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900, marginBottom: 6 }}>Member Since</div>
              <div style={{ fontWeight: 900 }}>{formatJoinDate(user.join_date)}</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900, marginBottom: 6 }}>Plan</div>
              <div style={{ fontWeight: 900 }}>Standard Member</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900, marginBottom: 6 }}>Status</div>
              <div style={{ fontWeight: 900 }}>Active</div>
            </div>

            <div className="glass" style={{ padding: 12 }}>
              <div className="muted" style={{ fontWeight: 900, marginBottom: 6 }}>Avatar Style</div>
              <div style={{ fontWeight: 900 }}>Generated Premium Avatar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}