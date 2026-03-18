import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredUser } from "../utils/auth";
import { addCartItem } from "../utils/cart";

const API_BASE = "http://localhost:3000";

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
      Shop Listing
    </text>
    <text x="60" y="220" fill="#ffffff" font-family="Arial" font-size="34" opacity="0.65">
      Image unavailable — placeholder shown
    </text>
  </svg>
`);

function ShopCover({ src, alt }) {
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
    </div>
  );
}

export default function Shop() {
  const user = getStoredUser();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    async function loadShop() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/shop`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load shop.");
        }

        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load shop.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadShop();
  }, []);

  async function handleAddToCart(listingId) {
    if (!user?.id) {
      alert("Please login first to add items to cart.");
      return;
    }

    try {
      setAddingId(listingId);
      await addCartItem(user.id, listingId, 1);
      alert("Added to cart.");
    } catch (err) {
      alert(err.message || "Failed to add item to cart.");
    } finally {
      setAddingId(null);
    }
  }

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    let next = items.filter((item) => {
      const matchesSearch =
        !q ||
        String(item.title || "").toLowerCase().includes(q) ||
        String(item.subtitle || "").toLowerCase().includes(q) ||
        String(item.store_name || "").toLowerCase().includes(q) ||
        String(item.publisher || "").toLowerCase().includes(q) ||
        (item.platforms || []).join(" ").toLowerCase().includes(q);

      const matchesStock =
        stockFilter === "all"
          ? true
          : stockFilter === "in_stock"
          ? String(item.stock_status || "").toLowerCase().includes("stock")
          : !String(item.stock_status || "").toLowerCase().includes("stock");

      return matchesSearch && matchesStock;
    });

    if (sortBy === "price_asc") {
      next = [...next].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_desc") {
      next = [...next].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "score_desc") {
      next = [...next].sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
    } else {
      next = [...next].sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
    }

    return next;
  }, [items, query, stockFilter, sortBy]);

  return (
    <div className="container" style={{ paddingBottom: 28 }}>
      <section className="pageHero" style={{ marginTop: 12 }}>
        <div className="pageHeroTop">
          <div>
            <div className="kicker">Storefront</div>
            <h1 className="heroTitle">Shop</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Browse live store listings for your favorite games and add them directly to your cart.
            </p>
          </div>

          <div className="heroBtns">
            <Link to="/games" className="btn ghost">Games</Link>
            <Link to="/cart" className="btn primary">View Cart</Link>
          </div>
        </div>

        <div className="pillRow">
          <span className="pill soft">{filteredItems.length} listings</span>
          <span className="pill">{user ? `Signed in as ${user.name}` : "Login required for cart"}</span>
        </div>
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <div className="filterBar">
          <input
            className="input"
            placeholder="Search by game, store, publisher, platform..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select className="input" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            <option value="all">All stock</option>
            <option value="in_stock">In stock</option>
            <option value="other">Other status</option>
          </select>

          <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="score_desc">Top Rated</option>
          </select>

          <Link to="/cart" className="btn subtle" style={{ display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
            Go to Cart
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="card" style={{ marginTop: 14 }}>Loading shop...</div>
      ) : error ? (
        <div className="card" style={{ marginTop: 14 }}>{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="card" style={{ marginTop: 14 }}>
          No listings found for the current filters.
        </div>
      ) : (
        <section className="gamesGrid" style={{ marginTop: 14 }}>
          {filteredItems.map((item) => (
            <div
              key={item.listing_id}
              className="card shadow-hover gameCard"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <ShopCover src={item.cover} alt={item.title} />

              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 950, letterSpacing: -0.3 }}>
                    {item.title}
                  </h3>

                  <span
                    style={{
                      marginLeft: "auto",
                      fontWeight: 950,
                      background: item.accent || "#ff2d55",
                      color: "#0b0c10",
                      padding: "4px 10px",
                      borderRadius: 999,
                      minWidth: 54,
                      textAlign: "center",
                    }}
                  >
                    {item.score ?? "—"}
                  </span>
                </div>

                <p className="muted" style={{ margin: "6px 0 10px" }}>
                  {item.subtitle || "Featured game"} {item.year ? `• ${item.year}` : ""}
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  <span className="chip">{item.store_name}</span>
                  <span className="chip">{item.stock_status || "Unknown"}</span>
                  {(item.platforms || []).slice(0, 2).map((platform) => (
                    <span key={platform} className="chip">{platform}</span>
                  ))}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 26, fontWeight: 950 }}>
                    {Number(item.price).toFixed(2)} {item.currency}
                  </div>
                  <div className="muted" style={{ marginTop: 4 }}>
                    Publisher: {item.publisher || "Unknown"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link to={`/games/${item.game_id}`} className="btn subtle sm">
                    View Details
                  </Link>

                  <button
                    type="button"
                    className="btn primary sm"
                    onClick={() => handleAddToCart(item.listing_id)}
                    disabled={addingId === item.listing_id}
                  >
                    {addingId === item.listing_id ? "Adding..." : "Add to Cart"}
                  </button>

                  {item.purchase_url ? (
                    <a
                      href={item.purchase_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn ghost sm"
                    >
                      Store Link
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}