import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.1-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.3 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.3 39.7 16.1 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5.1-5.6 6.6l.1-.1 6.2 5.2C35.6 40 44 34 44 24c0-1.1-.1-2.1-.4-3.5z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.3 4.6A16.9 16.9 0 0 0 16.2 3c-.2.4-.4.9-.6 1.3a15.4 15.4 0 0 0-4.6 0c-.2-.4-.4-.9-.6-1.3A17 17 0 0 0 6 4.6C3.5 8.3 2.8 11.9 3.1 15.4c1.7 1.3 3.4 2 5.2 2.5.4-.6.7-1.2 1-1.9-.6-.2-1.1-.5-1.6-.8l.4-.3c3 .9 6.2.9 9.2 0l.4.3c-.5.3-1 .6-1.6.8.3.7.6 1.3 1 1.9 1.8-.5 3.6-1.2 5.2-2.5.4-4-.7-7.6-2.9-10.8zM8.8 13.6c-.8 0-1.4-.7-1.4-1.6 0-.9.6-1.6 1.4-1.6s1.4.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6zm6.4 0c-.8 0-1.4-.7-1.4-1.6 0-.9.6-1.6 1.4-1.6s1.4.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6z"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setTimeout(function () {
      setLoading(false);
      navigate("/games");
    }, 650);
  }

  return (
    <div className="container" style={{ paddingTop: 22, paddingBottom: 30 }}>
      <div
        style={{
          minHeight: "calc(100vh - 140px)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          className="card"
          style={{
            width: "100%",
            maxWidth: 1020,
            padding: 0,
            overflow: "hidden",
            borderRadius: 22,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(320px, 1fr) minmax(380px, 1.2fr)",
            }}
          >
            {/* LEFT: form */}
            <div style={{ padding: 26 }}>
              {/* Brand */}
              <div style={{ fontWeight: 950, letterSpacing: 1.6, fontSize: 18 }}>
                <span style={{ color: "#ff2d55" }}>IGN</span>
              </div>

              <h1 style={{ margin: "14px 0 8px", fontSize: 34, fontWeight: 950, letterSpacing: -0.6 }}>
                Welcome back!
              </h1>

              <p style={{ margin: 0, opacity: 0.78, lineHeight: 1.6 }}>
                Login to rate games, write reviews, and manage your wishlist.
              </p>

              <form onSubmit={onSubmit} style={{ marginTop: 18 }}>
                <label style={{ display: "block", fontWeight: 850, marginBottom: 8 }}>
                  Email
                </label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: 999, height: 44 }}
                />

                <div style={{ height: 12 }} />

                <label style={{ display: "block", fontWeight: 850, marginBottom: 8 }}>
                  Password
                </label>
                <input
                  className="input"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: 999, height: 44 }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <a href="#" style={{ opacity: 0.8, fontSize: 13, fontWeight: 800 }}>
                    Forgot password?
                  </a>
                </div>

                {error ? (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "10px 12px",
                      borderRadius: 14,
                      border: "1px solid rgba(255,45,85,0.45)",
                      background: "rgba(255,45,85,0.12)",
                      fontWeight: 700,
                    }}
                  >
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                  style={{
                    width: "100%",
                    marginTop: 14,
                    borderRadius: 999,
                    height: 44,
                    fontWeight: 900,
                    letterSpacing: 0.3,
                  }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Divider */}
                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    opacity: 0.75,
                    fontSize: 13,
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
                  or continue with
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
                </div>

                {/* Social icons */}
                <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setError("Google login will be added later.")}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      cursor: "pointer",
                      transition: "transform .15s ease, background .15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                    aria-label="Continue with Google"
                    title="Continue with Google"
                  >
                    <GoogleIcon />
                  </button>

                  <button
                    type="button"
                    onClick={() => setError("Discord login will be added later.")}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      cursor: "pointer",
                      transition: "transform .15s ease, background .15s ease",
                      color: "rgba(243,244,248,0.92)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                    aria-label="Continue with Discord"
                    title="Continue with Discord"
                  >
                    <DiscordIcon />
                  </button>
                </div>

                <p style={{ marginTop: 18, opacity: 0.78, fontSize: 13 }}>
                  Not a member?{" "}
                  <Link to="/register" style={{ fontWeight: 900 }}>
                    Register now
                  </Link>
                </p>

                <div style={{ marginTop: 6 }}>
                  <Link to="/" style={{ opacity: 0.7, fontSize: 12, fontWeight: 800 }}>
                    ← Back to Home
                  </Link>
                </div>
              </form>
            </div>

            {/* RIGHT: game picture panel */}
            <div
              style={{
                position: "relative",
                minHeight: 560,
                backgroundImage:
                  "url(https://images.hdqwalls.com/download/red-dead-redemption-2-takes-over-dh-1920x1080.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay for premium text visibility */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(120deg, rgba(11,12,16,0.25), rgba(11,12,16,0.65))",
                }}
              />

              <div style={{ position: "absolute", left: 22, right: 22, bottom: 22 }}>
                <div
                  style={{
                    display: "inline-flex",
                    gap: 10,
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    backdropFilter: "blur(10px)",
                    fontWeight: 900,
                  }}
                >
                  Featured this week <span style={{ color: "#ff2d55" }}>RDR2</span>
                </div>

                <h2 style={{ margin: "12px 0 0", fontSize: 26, fontWeight: 950, letterSpacing: -0.4 }}>
                  A world that feels alive.
                </h2>
                <p style={{ margin: "8px 0 0", opacity: 0.85, lineHeight: 1.6 }}>
                  Log in to track games, write reviews, and see ratings from the community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}