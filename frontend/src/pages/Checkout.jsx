import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getStoredUser } from "../utils/auth";
import { fetchCart } from "../utils/cart";
import { submitCheckout } from "../utils/orders";

function formatMoney(value, currency = "USD") {
  return `${Number(value || 0).toFixed(2)} ${currency}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [cart, setCart] = useState({
    items: [],
    total: 0,
    itemCount: 0,
    uniqueCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    billingAddress: "",
    paymentMethod: "Credit Card",
  });

  useEffect(() => {
    async function loadCart() {
      if (!user?.id) {
        setCart({
          items: [],
          total: 0,
          itemCount: 0,
          uniqueCount: 0,
        });
        setLoading(false);
        return;
      }

      try {
        setError("");
        setLoading(true);
        const data = await fetchCart(user.id);
        setCart({
          items: Array.isArray(data?.items) ? data.items : [],
          total: Number(data?.total || 0),
          itemCount: Number(data?.itemCount || 0),
          uniqueCount: Number(data?.uniqueCount || 0),
        });
      } catch (err) {
        setError(err.message || "Failed to load cart.");
        setCart({
          items: [],
          total: 0,
          itemCount: 0,
          uniqueCount: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [user?.id]);

  const subtotal = useMemo(() => Number(cart.total || 0), [cart.total]);
  const tax = 0;
  const serviceFee = 0;
  const grandTotal = subtotal;

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e) {
    if (e?.preventDefault) e.preventDefault();

    if (!user?.id) {
      alert("Please login first.");
      return;
    }

    if (!form.customerName.trim()) {
      alert("Enter your full name.");
      return;
    }

    if (!form.customerEmail.trim()) {
      alert("Enter your email.");
      return;
    }

    if (!form.billingAddress.trim()) {
      alert("Enter your billing address.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await submitCheckout(user.id, {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        billingAddress: form.billingAddress.trim(),
        paymentMethod: form.paymentMethod,
      });

      navigate(`/order-success?orderId=${result.order.order_id}`);
    } catch (err) {
      setError(err.message || "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user?.id) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <section className="pageHero" style={{ marginTop: 12 }}>
          <div className="pageHeroTop">
            <div>
              <div className="kicker">Checkout</div>
              <h1 className="heroTitle">Secure Purchase</h1>
              <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
                Login to continue with billing and payment.
              </p>
            </div>
          </div>
        </section>

        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ marginTop: 0, fontWeight: 950 }}>Login required</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            Please sign in to complete your order.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Link to="/login" className="btn primary">Login</Link>
            <Link to="/cart" className="btn ghost">Back to Cart</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <div className="card" style={{ marginTop: 14 }}>Loading checkout...</div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <section className="pageHero" style={{ marginTop: 12 }}>
          <div className="pageHeroTop">
            <div>
              <div className="kicker">Checkout</div>
              <h1 className="heroTitle">Your cart is empty</h1>
              <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
                Add a few games before continuing to checkout.
              </p>
            </div>
          </div>
        </section>

        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ marginTop: 0, fontWeight: 950 }}>Nothing to purchase yet</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            Browse the shop and add games to your cart first.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Link to="/shop" className="btn primary">Go to Shop</Link>
            <Link to="/cart" className="btn ghost">Back to Cart</Link>
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
            <div className="kicker">Checkout</div>
            <h1 className="heroTitle">Complete Your Purchase</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Confirm your billing details, review your order summary, and complete your purchase securely.
            </p>
          </div>

          <div className="heroBtns">
            <Link to="/cart" className="btn ghost">Back to Cart</Link>
            <Link to="/shop" className="btn subtle">Continue Shopping</Link>
          </div>
        </div>

        <div className="pillRow">
          <span className="pill soft">Items: {cart.itemCount}</span>
          <span className="pill">Listings: {cart.uniqueCount}</span>
          <span className="pill">Subtotal: {formatMoney(subtotal, "USD")}</span>
        </div>
      </section>

      <div
        className="cart-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 14,
          marginTop: 14,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <form className="card" onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div className="kicker">Billing</div>
                <h2 style={{ marginTop: 6, fontWeight: 950 }}>Payment Details</h2>
              </div>

              <div className="glass" style={{ padding: "10px 12px", minWidth: 180 }}>
                <div className="muted" style={{ fontWeight: 900 }}>Secure Checkout</div>
                <div style={{ fontWeight: 900, marginTop: 4 }}>Encrypted Session</div>
              </div>
            </div>

            {error ? (
              <div className="glass" style={{ padding: 12, marginTop: 14 }}>
                {error}
              </div>
            ) : null}

            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <div className="muted" style={{ fontWeight: 900, marginBottom: 8 }}>Full Name</div>
                  <input
                    className="input"
                    placeholder="Full name"
                    value={form.customerName}
                    onChange={(e) => updateField("customerName", e.target.value)}
                  />
                </div>

                <div>
                  <div className="muted" style={{ fontWeight: 900, marginBottom: 8 }}>Email Address</div>
                  <input
                    className="input"
                    placeholder="Email address"
                    value={form.customerEmail}
                    onChange={(e) => updateField("customerEmail", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="muted" style={{ fontWeight: 900, marginBottom: 8 }}>Billing Address</div>
                <textarea
                  className="input"
                  rows={5}
                  placeholder="Street, city, postal code, country"
                  value={form.billingAddress}
                  onChange={(e) => updateField("billingAddress", e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div>
                <div className="muted" style={{ fontWeight: 900, marginBottom: 8 }}>Payment Method</div>
                <select
                  className="input"
                  value={form.paymentMethod}
                  onChange={(e) => updateField("paymentMethod", e.target.value)}
                >
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>PayPal</option>
                  <option>Cash on Delivery</option>
                </select>
              </div>

              <button type="submit" className="btn primary" disabled={submitting} style={{ marginTop: 6 }}>
                {submitting ? "Processing..." : `Pay ${formatMoney(grandTotal, "USD")}`}
              </button>
            </div>
          </form>

          <div className="card">
            <div className="kicker">Items</div>
            <h2 style={{ marginTop: 6, fontWeight: 950 }}>Order Items</h2>

            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              {cart.items.map((item) => (
                <div
                  key={item.listing_id}
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
                    <div style={{ fontWeight: 900, fontSize: 16 }}>{item.title}</div>
                    <div className="muted" style={{ marginTop: 4 }}>
                      {item.store_name} • Qty: {item.quantity}
                    </div>
                  </div>

                  <div style={{ minWidth: 130, textAlign: "right" }}>
                    <div className="muted" style={{ fontSize: 12 }}>Subtotal</div>
                    <div style={{ fontWeight: 950 }}>
                      {formatMoney(item.subtotal, item.currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 14 }}>
          <div className="card" style={{ position: "sticky", top: 12 }}>
            <div className="kicker">Summary</div>
            <h2 style={{ marginTop: 6, fontWeight: 950 }}>Order Overview</h2>

            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <div className="glass" style={{ padding: 12 }}>
                <div className="muted" style={{ fontWeight: 900 }}>Items</div>
                <div style={{ fontWeight: 950, fontSize: 24, marginTop: 4 }}>
                  {cart.itemCount}
                </div>
              </div>

              <div className="glass" style={{ padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span className="muted">Subtotal</span>
                  <strong>{formatMoney(subtotal, "USD")}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10 }}>
                  <span className="muted">Tax</span>
                  <strong>{formatMoney(tax, "USD")}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10 }}>
                  <span className="muted">Service Fee</span>
                  <strong>{formatMoney(serviceFee, "USD")}</strong>
                </div>

                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.10)",
                    margin: "12px 0",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontWeight: 900 }}>Grand Total</span>
                  <strong style={{ fontSize: 20 }}>{formatMoney(grandTotal, "USD")}</strong>
                </div>
              </div>

              <div className="glass" style={{ padding: 12 }}>
                <div className="muted" style={{ fontWeight: 900 }}>Account</div>
                <div style={{ fontWeight: 900, marginTop: 4 }}>{user.name}</div>
                <div className="muted" style={{ marginTop: 4 }}>{user.email}</div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              <button
                type="button"
                className="btn primary"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Processing..." : "Confirm Purchase"}
              </button>

              <Link to="/cart" className="btn ghost" style={{ textAlign: "center" }}>
                Edit Cart
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}