import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
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
          <NavLink to="/" style={({ isActive }) => ({ opacity: isActive ? 1 : 0.75, fontWeight: 700 })}>
            Home
          </NavLink>
          <NavLink to="/games" style={({ isActive }) => ({ opacity: isActive ? 1 : 0.75, fontWeight: 700 })}>
            Games
          </NavLink>
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <input className="input" placeholder="Search games..." style={{ width: 260 }} />
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn primary">Register</Link>
        </div>
      </div>
    </header>
  );
}