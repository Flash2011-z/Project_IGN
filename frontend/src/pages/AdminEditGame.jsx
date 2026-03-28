import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authHeader } from "../utils/auth";

const API_BASE = "http://localhost:4000";

function parseCommaList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeEditForm(game) {
  const firstListing = Array.isArray(game?.listings) && game.listings.length > 0 ? game.listings[0] : null;

  return {
    title: game?.title || "",
    subtitle: game?.subtitle || "",
    description: game?.description || "",
    releaseYear: game?.year ? String(game.year) : "",
    publisherName: game?.publisher || "Unknown",
    cover: game?.cover || "",
    accent: game?.accent || "#ff2d55",
    storeName: firstListing?.store_name || "Steam",
    price: firstListing?.price != null ? String(firstListing.price) : "0",
    currency: firstListing?.currency || "USD",
    stockStatus: firstListing?.stock_status || "in_stock",
    genres: Array.isArray(game?.genres) ? game.genres.join(", ") : "",
    platforms: Array.isArray(game?.platforms) ? game.platforms.join(", ") : "",
  };
}

export default function AdminEditGame() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(null);

  const gameId = useMemo(() => {
    const parsed = parseInt(id, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [id]);

  useEffect(() => {
    async function loadGame() {
      if (!gameId) {
        setError("Invalid game id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/games/${gameId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load game details.");
        }

        setForm(normalizeEditForm(data));
      } catch (err) {
        setError(err.message || "Failed to load game details.");
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [gameId]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!gameId || !form) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        releaseYear: form.releaseYear,
        publisherName: form.publisherName,
        cover: form.cover,
        accent: form.accent,
        storeName: form.storeName,
        price: form.price,
        currency: form.currency,
        stockStatus: form.stockStatus,
        genres: parseCommaList(form.genres),
        platforms: parseCommaList(form.platforms),
      };

      const response = await fetch(`${API_BASE}/admin/games/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update game.");
      }

      setMessage("Game updated successfully.");

      setTimeout(() => {
        navigate("/admin", {
          replace: true,
          state: { adminMessage: `Updated ${form.title || "game"} successfully.` },
        });
      }, 450);
    } catch (err) {
      setError(err.message || "Failed to update game.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <div className="card" style={{ marginTop: 14 }}>Loading game editor...</div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <div className="card" style={{ marginTop: 14 }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="container adminShell" style={{ paddingBottom: 32 }}>
      {/* HERO SECTION: Premium edit header with navigation */}
      <section className="adminHero">
        <div className="adminHeroTop">
          <div>
            <div className="adminHeroKicker">⚙️ Admin Console</div>
            <h1 className="adminHeroTitle">Edit Game</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760, fontSize: 14 }}>
              Update core content, metadata, and primary store listing for this game.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/admin" className="btn ghost">← Back to Admin</Link>
            <Link to={`/games/${gameId}`} className="btn subtle">🔍 View Game</Link>
          </div>
        </div>
      </section>

      {/* Success/Error messages */}
      {message ? (
        <section className="adminNotification success">
          <span className="adminNotificationIcon">✓</span>
          <span>{message}</span>
          <button
            type="button"
            className="adminNotificationClose"
            onClick={() => setMessage("")}
          >
            ✕
          </button>
        </section>
      ) : null}

      {error ? (
        <section className="adminNotification error">
          <span className="adminNotificationIcon">⚠</span>
          <span>{error}</span>
          <button
            type="button"
            className="adminNotificationClose"
            onClick={() => setError("")}
          >
            ✕
          </button>
        </section>
      ) : null}

      {/* EDIT FORM: Premium grouped sections */}
      <section className="adminSection">
        <form onSubmit={handleSubmit} className="adminForm">
          {/* Core Info Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Basic Information</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Game Title *</label>
                <input
                  className="adminFormField"
                  placeholder="e.g., Cyberpunk 2077"
                  value={form?.title || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Subtitle</label>
                <input
                  className="adminFormField"
                  placeholder="e.g., Phantom Liberty"
                  value={form?.subtitle || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>
            </div>
            <div className="adminFormGroup">
              <label className="adminFormLabel">Description</label>
              <textarea
                className="adminFormField"
                placeholder="Enter game description..."
                rows={4}
                value={form?.description || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Media & Appearance</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Cover Image URL</label>
                <input
                  className="adminFormField"
                  placeholder="https://..."
                  value={form?.cover || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, cover: e.target.value }))}
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Accent Color</label>
                <input
                  className="adminFormField"
                  type="color"
                  value={form?.accent || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, accent: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Publisher & Release Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Publisher & Release</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Publisher *</label>
                <input
                  className="adminFormField"
                  placeholder="e.g., CD Projekt Red"
                  value={form?.publisherName || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, publisherName: e.target.value }))}
                  required
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Release Year *</label>
                <input
                  className="adminFormField"
                  type="number"
                  placeholder="YYYY"
                  value={form?.releaseYear || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, releaseYear: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Store & Pricing Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Store & Pricing</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Store Name *</label>
                <input
                  className="adminFormField"
                  placeholder="e.g., Steam"
                  value={form?.storeName || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, storeName: e.target.value }))}
                  required
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Price *</label>
                <input
                  className="adminFormField"
                  type="number"
                  placeholder="59.99"
                  value={form?.price || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Currency *</label>
                <input
                  className="adminFormField"
                  placeholder="USD, EUR, GBP"
                  value={form?.currency || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
                  required
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Stock Status *</label>
                <input
                  className="adminFormField"
                  placeholder="in_stock, pre_order, out_of_stock"
                  value={form?.stockStatus || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, stockStatus: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="adminFormSection">
            <div className="adminFormSectionTitle">Genres & Platforms</div>
            <div className="adminFormFieldGrid">
              <div className="adminFormGroup">
                <label className="adminFormLabel">Genres (comma separated)</label>
                <input
                  className="adminFormField"
                  placeholder="Action, Adventure, RPG"
                  value={form?.genres || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, genres: e.target.value }))}
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminFormLabel">Platforms (comma separated)</label>
                <input
                  className="adminFormField"
                  placeholder="PC, PS5, Xbox Series X"
                  value={form?.platforms || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, platforms: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
            <Link to="/admin" className="btn ghost">Cancel</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
