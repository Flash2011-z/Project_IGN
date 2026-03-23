import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getStoredUser } from "../utils/auth";
import { fetchOrders } from "../utils/orders";

function formatDateTime(value) {
  if (!value) return "Unknown date";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown date";

  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMoney(value, currency = "USD") {
  return `${Number(value || 0).toFixed(2)} ${currency}`;
}

export default function Orders() {
  const user = getStoredUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setError("");
        const data = await fetchOrders(user.id);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user?.id]);

  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => sum + Number(order.total_items || 0), 0);
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    return {
      totalOrders,
      totalItems,
      totalSpent,
    };
  }, [orders]);

  if (!user?.id) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <section className="pageHero" style={{ marginTop: 12 }}>
          <div className="pageHeroTop">
            <div>
              <div className="kicker">Account</div>
              <h1 className="heroTitle">Orders</h1>
              <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
                Sign in to view your purchase history and completed orders.
              </p>
            </div>
          </div>
        </section>

        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ marginTop: 0, fontWeight: 950 }}>You are not logged in</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            Login first to access your order history.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Link to="/login" className="btn primary">Login</Link>
            <Link to="/shop" className="btn ghost">Go to Shop</Link>
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
            <div className="kicker">Purchase History</div>
            <h1 className="heroTitle">My Orders</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Review your completed purchases, track your order totals, and revisit previously bought games.
            </p>
          </div>

          <div className="heroBtns">
            <Link to="/profile" className="btn ghost">Back to Profile</Link>
            <Link to="/shop" className="btn subtle">Continue Shopping</Link>
          </div>
        </div>

        <div className="pillRow">
          <span className="pill soft">Orders: {summary.totalOrders}</span>
          <span className="pill">Items purchased: {summary.totalItems}</span>
          <span className="pill">Spent: {formatMoney(summary.totalSpent, "USD")}</span>
        </div>
      </section>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "1.25fr 0.75fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 14 }}>
          {loading ? (
            <div className="card">Loading orders...</div>
          ) : error ? (
            <div className="card">{error}</div>
          ) : orders.length === 0 ? (
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ marginTop: 0, fontWeight: 950 }}>No orders yet</h2>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Once you complete a purchase, your order history will appear here.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                <Link to="/shop" className="btn primary">Browse Shop</Link>
                <Link to="/cart" className="btn ghost">Open Cart</Link>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <section key={order.order_id} className="card shadow-hover">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                    flexWrap: "wrap",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <div className="kicker">Order #{order.order_id}</div>
                    <h2 style={{ margin: "6px 0 0", fontWeight: 950, letterSpacing: -0.3 }}>
                      {formatMoney(order.total_amount, order.currency)}
                    </h2>
                    <p className="muted" style={{ margin: "8px 0 0" }}>
                      {formatDateTime(order.created_at)}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      minWidth: 220,
                    }}
                  >
                    <div className="glass" style={{ padding: 10 }}>
                      <div className="muted" style={{ fontWeight: 900 }}>Status</div>
                      <div style={{ fontWeight: 900, marginTop: 4 }}>
                        {order.order_status || "confirmed"}
                      </div>
                    </div>

                    <div className="glass" style={{ padding: 10 }}>
                      <div className="muted" style={{ fontWeight: 900 }}>Payment</div>
                      <div style={{ fontWeight: 900, marginTop: 4 }}>
                        {order.payment_method || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 10,
                  }}
                >
                  <div className="glass" style={{ padding: 12 }}>
                    <div className="muted" style={{ fontWeight: 900 }}>Items</div>
                    <div style={{ fontWeight: 950, fontSize: 24, marginTop: 4 }}>
                      {Number(order.total_items || 0)}
                    </div>
                  </div>

                  <div className="glass" style={{ padding: 12 }}>
                    <div className="muted" style={{ fontWeight: 900 }}>Customer</div>
                    <div style={{ fontWeight: 900, marginTop: 4 }}>
                      {order.customer_name || user.name}
                    </div>
                  </div>

                  <div className="glass" style={{ padding: 12 }}>
                    <div className="muted" style={{ fontWeight: 900 }}>Currency</div>
                    <div style={{ fontWeight: 900, marginTop: 4 }}>
                      {order.currency || "USD"}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <h3 style={{ marginTop: 0, fontWeight: 950 }}>Purchased Items</h3>

                  <div style={{ display: "grid", gap: 12 }}>
                    {(order.items || []).map((item) => (
                      <div
                        key={item.order_item_id}
                        className="glass"
                        style={{
                          padding: 12,
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 14,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ minWidth: 220, flex: 1 }}>
                          <div style={{ fontWeight: 900, fontSize: 16 }}>
                            {item.title}
                          </div>

                          <div className="muted" style={{ marginTop: 4 }}>
                            {item.store_name || "Store"} • Qty: {Number(item.quantity || 0)}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 18,
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div style={{ minWidth: 110, textAlign: "right" }}>
                            <div className="muted" style={{ fontSize: 12 }}>Unit</div>
                            <div style={{ fontWeight: 900 }}>
                              {formatMoney(item.unit_price, order.currency)}
                            </div>
                          </div>

                          <div style={{ minWidth: 120, textAlign: "right" }}>
                            <div className="muted" style={{ fontSize: 12 }}>Subtotal</div>
                            <div style={{ fontWeight: 950 }}>
                              {formatMoney(item.subtotal, order.currency)}
                            </div>
                          </div>

                          <Link
                            to={`/games/${item.game_id}`}
                            className="btn subtle"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            View Game
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div className="muted" style={{ maxWidth: 680 }}>
                    Billing: {order.billing_address || "No billing address stored"}
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 14,
                      padding: "10px 14px",
                      fontWeight: 950,
                    }}
                  >
                    Total: {formatMoney(order.total_amount, order.currency)}
                  </div>
                </div>
              </section>
            ))
          )}
        </div>

        <aside style={{ display: "grid", gap: 14 }}>
          <div className="card" style={{ position: "sticky", top: 12 }}>
            <div className="kicker">Overview</div>
            <h2 style={{ marginTop: 6, fontWeight: 950 }}>Account Summary</h2>

            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <div className="glass" style={{ padding: 12 }}>
                <div className="muted" style={{ fontWeight: 900 }}>Orders placed</div>
                <div style={{ fontWeight: 950, fontSize: 24, marginTop: 4 }}>
                  {summary.totalOrders}
                </div>
              </div>

              <div className="glass" style={{ padding: 12 }}>
                <div className="muted" style={{ fontWeight: 900 }}>Items purchased</div>
                <div style={{ fontWeight: 950, fontSize: 24, marginTop: 4 }}>
                  {summary.totalItems}
                </div>
              </div>

              <div className="glass" style={{ padding: 12 }}>
                <div className="muted" style={{ fontWeight: 900 }}>Total spent</div>
                <div style={{ fontWeight: 950, fontSize: 24, marginTop: 4 }}>
                  {formatMoney(summary.totalSpent, "USD")}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              <Link to="/shop" className="btn primary" style={{ textAlign: "center" }}>
                Buy More Games
              </Link>

              <Link to="/profile" className="btn ghost" style={{ textAlign: "center" }}>
                Back to Profile
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}