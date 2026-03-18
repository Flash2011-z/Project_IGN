import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AUTH_EVENT, CART_EVENT, getStoredUser } from "../utils/auth";
import { fetchCart, removeCartItem, updateCartItem } from "../utils/cart";

export default function Cart() {
    const [user, setUser] = useState(() => getStoredUser());
    const [cart, setCart] = useState({
        items: [],
        total: 0,
        itemCount: 0,
        uniqueCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [error, setError] = useState("");

    async function loadCart(nextUser = getStoredUser()) {
        setUser(nextUser);

        if (!nextUser?.id) {
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
            setLoading(true);
            setError("");
            const data = await fetchCart(nextUser.id);
            setCart(data);
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

    useEffect(() => {
        loadCart();

        function handleRefresh() {
            loadCart(getStoredUser());
        }

        window.addEventListener("focus", handleRefresh);
        window.addEventListener(AUTH_EVENT, handleRefresh);
        window.addEventListener(CART_EVENT, handleRefresh);

        return () => {
            window.removeEventListener("focus", handleRefresh);
            window.removeEventListener(AUTH_EVENT, handleRefresh);
            window.removeEventListener(CART_EVENT, handleRefresh);
        };
    }, []);

    async function changeQuantity(listingId, nextQuantity) {
        if (!user?.id) return;

        try {
            setBusyId(listingId);

            if (nextQuantity <= 0) {
                await removeCartItem(user.id, listingId);
            } else {
                await updateCartItem(user.id, listingId, nextQuantity);
            }

            await loadCart(user);
        } catch (err) {
            setError(err.message || "Failed to update cart.");
        } finally {
            setBusyId(null);
        }
    }

    async function handleRemove(listingId) {
        if (!user?.id) return;

        try {
            setBusyId(listingId);
            await removeCartItem(user.id, listingId);
            await loadCart(user);
        } catch (err) {
            setError(err.message || "Failed to remove item.");
        } finally {
            setBusyId(null);
        }
    }

    const total = useMemo(() => Number(cart.total || 0), [cart.total]);

    if (!user) {
        return (
            <div className="container" style={{ paddingBottom: 28 }}>
                <section className="pageHero" style={{ marginTop: 12 }}>
                    <div className="pageHeroTop">
                        <div>
                            <div className="kicker">Checkout</div>
                            <h1 className="heroTitle">Cart</h1>
                            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
                                Login to see the cart connected to your account.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="card" style={{ marginTop: 14 }}>
                    <h3 style={{ marginTop: 0, fontWeight: 950 }}>You are not logged in</h3>
                    <p className="muted" style={{ margin: "6px 0 12px" }}>
                        Sign in first to add games and manage your cart.
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
                        <div className="kicker">Checkout</div>
                        <h1 className="heroTitle">My Cart</h1>
                        <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
                            Review your selected listings before moving to checkout.
                        </p>
                    </div>

                    <div className="heroBtns">
                        <Link to="/shop" className="btn ghost">Continue Shopping</Link>
                    </div>
                </div>

                <div className="pillRow">
                    <span className="pill soft">{cart.itemCount} items</span>
                    <span className="pill">{cart.uniqueCount} listings</span>
                    <span className="pill">User: {user.name}</span>
                </div>
            </section>

            {loading ? (
                <div className="card" style={{ marginTop: 14 }}>Loading cart...</div>
            ) : error ? (
                <div className="card" style={{ marginTop: 14 }}>{error}</div>
            ) : cart.items.length === 0 ? (
                <div className="card" style={{ marginTop: 14 }}>
                    <h3 style={{ marginTop: 0, fontWeight: 950 }}>Your cart is empty</h3>
                    <p className="muted" style={{ margin: "6px 0 12px" }}>
                        Browse the shop and add some games.
                    </p>
                    <Link to="/shop" className="btn primary">Go to Shop</Link>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.5fr 0.8fr",
                        gap: 14,
                        marginTop: 14,
                    }}
                >
                    <div style={{ display: "grid", gap: 14 }}>
                        {cart.items.map((item) => (
                            <div key={item.listing_id} className="card">
                                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                                    <img
                                        src={item.cover}
                                        alt={item.title}
                                        style={{
                                            width: 150,
                                            height: 90,
                                            objectFit: "cover",
                                            borderRadius: 14,
                                            border: "1px solid rgba(255,255,255,0.10)",
                                        }}
                                    />

                                    <div style={{ flex: 1, minWidth: 220 }}>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                            <h3 style={{ margin: 0, fontWeight: 950 }}>{item.title}</h3>
                                            <span className="chip">{item.store_name}</span>
                                            <span className="chip">{item.currency}</span>
                                        </div>

                                        <p className="muted" style={{ margin: "8px 0 10px" }}>
                                            {item.subtitle || "Store listing"} {item.year ? `• ${item.year}` : ""}
                                        </p>

                                        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 10 }}>
                                            {Number(item.price).toFixed(2)} {item.currency}
                                        </div>

                                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                            <button
                                                type="button"
                                                className="btn subtle sm"
                                                onClick={() => changeQuantity(item.listing_id, Number(item.quantity) - 1)}
                                                disabled={busyId === item.listing_id}
                                            >
                                                −
                                            </button>

                                            <span className="pill soft">Qty: {item.quantity}</span>

                                            <button
                                                type="button"
                                                className="btn subtle sm"
                                                onClick={() => changeQuantity(item.listing_id, Number(item.quantity) + 1)}
                                                disabled={busyId === item.listing_id}
                                            >
                                                +
                                            </button>

                                            <button
                                                type="button"
                                                className="btn ghost sm"
                                                onClick={() => handleRemove(item.listing_id)}
                                                disabled={busyId === item.listing_id}
                                            >
                                                Remove
                                            </button>

                                            <Link to={`/games/${item.game_id}`} className="btn sm">
                                                Details
                                            </Link>
                                        </div>
                                    </div>

                                    <div style={{ minWidth: 150, marginLeft: "auto" }}>
                                        <div className="muted" style={{ marginBottom: 6 }}>Subtotal</div>
                                        <div style={{ fontWeight: 950, fontSize: 24 }}>
                                            {Number(item.subtotal).toFixed(2)} {item.currency}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="card" style={{ height: "fit-content" }}>
                        <div className="kicker">Summary</div>
                        <h2 style={{ marginTop: 6, marginBottom: 16, fontWeight: 950 }}>Order Overview</h2>

                        <div style={{ display: "grid", gap: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <span className="muted">Items</span>
                                <strong>{cart.itemCount}</strong>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <span className="muted">Unique listings</span>
                                <strong>{cart.uniqueCount}</strong>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <span className="muted">Estimated total</span>
                                <strong>{total.toFixed(2)} USD</strong>
                            </div>
                        </div>

                        <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
                            <Link
                                to="/checkout"
                                className="btn primary"
                                style={{ width: "100%", marginTop: 14, display: "block", textAlign: "center" }}
                            >
                                Proceed to Checkout
                            </Link>
                            <Link to="/shop" className="btn ghost" style={{ textAlign: "center" }}>
                                Add More Games
                            </Link>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}