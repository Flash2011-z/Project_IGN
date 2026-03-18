import { Link, useSearchParams } from "react-router-dom";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container" style={{ paddingBottom: 28 }}>
      <div className="card" style={{ marginTop: 20, textAlign: "center", padding: 28 }}>
        <div className="kicker">Success</div>
        <h1 style={{ marginTop: 8, fontWeight: 950 }}>Order Confirmed</h1>

        <p className="muted" style={{ maxWidth: 700, margin: "12px auto 0" }}>
          Your purchase has been completed successfully.
          {orderId ? ` Order #${orderId} has been created.` : ""}
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          <Link to="/orders" className="btn primary">View Orders</Link>
          <Link to="/shop" className="btn ghost">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}