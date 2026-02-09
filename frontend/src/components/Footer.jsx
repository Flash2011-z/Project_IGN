export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #e7e7ef", padding: "18px 0", marginTop: 24 }}>
      <div className="container" style={{ color: "#444" }}>
        <small>© {new Date().getFullYear()} Project IGN — DBMS Project</small>
      </div>
    </footer>
  );
}