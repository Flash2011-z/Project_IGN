import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getStoredUser, setStoredUser, authHeader } from "../utils/auth";
import { getAvatarUrl } from "../utils/avatar";

const API_BASE = "http://localhost:4000";

const AVATAR_STYLES = [
  "adventurer",
  "adventurer-neutral",
  "avataaars",
  "big-smile",
  "bottts",
  "fun-emoji",
  "icons",
  "lorelei",
  "micah",
  "shapes",
];

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarStyle, setAvatarStyle] = useState("adventurer");
  const [avatarSeed, setAvatarSeed] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);

    if (!stored?.id) return;

    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE}/profile/${stored.id}`, {
          headers: {
            ...authHeader(),
          },
        });
        const data = await res.json();

        if (!res.ok) return;

        const nextUser = setStoredUser(data.user || {});
        setUser(nextUser);

        setUsername(nextUser.name || "");
        setBio(nextUser.bio || "");
        setAvatarStyle(nextUser.avatar_style || "adventurer");
        setAvatarSeed(nextUser.avatar_seed || nextUser.name || "");
      } catch {
      }
    }

    loadProfile();
  }, []);

  const previewUser = useMemo(() => {
    if (!user) return null;

    return {
      ...user,
      name: username,
      bio: bio,
      avatar_style: avatarStyle,
      avatar_seed: avatarSeed || username,
    };
  }, [user, username, bio, avatarStyle, avatarSeed]);

  async function handleProfileSave(e) {
    e.preventDefault();

    if (!user?.id) return;

    setProfileMessage("");
    setProfileError("");

    const cleanUsername = username.trim();
    const cleanBio = bio;
    const cleanAvatarSeed = avatarSeed.trim() || cleanUsername;

    if (!cleanUsername) {
      setProfileError("Username is required.");
      return;
    }

    if (cleanUsername.length < 3) {
      setProfileError("Username must be at least 3 characters.");
      return;
    }

    if (cleanBio.length > 300) {
      setProfileError("Bio must be at most 300 characters.");
      return;
    }

    try {
      setProfileSaving(true);

      const res = await fetch(`${API_BASE}/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({
          username: cleanUsername,
          bio: cleanBio,
          avatar_style: avatarStyle,
          avatar_seed: cleanAvatarSeed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data?.error || "Failed to update profile.");
        return;
      }

      const nextUser = setStoredUser(data.user || {});
      setUser(nextUser);
      setUsername(nextUser.name || "");
      setBio(nextUser.bio || "");
      setAvatarStyle(nextUser.avatar_style || "adventurer");
      setAvatarSeed(nextUser.avatar_seed || nextUser.name || "");
      setProfileMessage("Profile updated successfully.");
    } catch {
      setProfileError("Could not connect to backend.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSave(e) {
    e.preventDefault();

    if (!user?.id) return;

    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setPasswordSaving(true);

      const res = await fetch(`${API_BASE}/profile/${user.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data?.error || "Failed to update password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Password updated successfully.");
    } catch {
      setPasswordError("Could not connect to backend.");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="container" style={{ paddingBottom: 28 }}>
        <div className="card" style={{ marginTop: 14, padding: 24 }}>
          <h2 style={{ marginTop: 0, fontWeight: 950 }}>You are not logged in</h2>
          <p className="muted">Please login first.</p>
          <Link to="/login" className="btn primary">Login</Link>
        </div>
      </div>
    );
  }

  const avatarUrl = getAvatarUrl(previewUser);

  return (
    <div className="container" style={{ paddingBottom: 28 }}>
      <section className="pageHero" style={{ marginTop: 12 }}>
        <div className="pageHeroTop">
          <div>
            <div className="kicker">Account</div>
            <h1 className="heroTitle">Edit Profile</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Update your profile details and account password.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/profile" className="btn ghost">Back to profile</Link>
          </div>
        </div>
      </section>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 14,
        }}
      >
        <form className="card" onSubmit={handleProfileSave}>
          <div className="kicker">Preview</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, marginBottom: 18 }}>
            <img
              src={avatarUrl}
              alt="Preview avatar"
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                objectFit: "cover",
                background: "#111",
                border: "2px solid rgba(255,255,255,0.12)",
              }}
            />

            <div>
              <h2 style={{ margin: 0, fontWeight: 950 }}>{username || "Your name"}</h2>
              <p className="muted" style={{ margin: "6px 0 0" }}>{user.email}</p>
            </div>
          </div>

          <label style={{ display: "block", fontWeight: 850, marginBottom: 8 }}>Username</label>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
          />

          <label style={{ display: "block", fontWeight: 850, marginTop: 14, marginBottom: 8 }}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your bio here"
            rows={5}
            style={{
              width: "100%",
              minHeight: 120,
              resize: "vertical",
              borderRadius: 16,
              padding: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "inherit",
              outline: "none",
              font: "inherit",
            }}
          />

          <label style={{ display: "block", fontWeight: 850, marginTop: 14, marginBottom: 8 }}>Avatar Style</label>
          <select
            className="input"
            value={avatarStyle}
            onChange={(e) => setAvatarStyle(e.target.value)}
          >
            {AVATAR_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>

          <label style={{ display: "block", fontWeight: 850, marginTop: 14, marginBottom: 8 }}>Avatar Seed</label>
          <input
            className="input"
            value={avatarSeed}
            onChange={(e) => setAvatarSeed(e.target.value)}
            placeholder="Any text to change avatar look"
          />

          {profileError ? (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,45,85,0.45)",
                background: "rgba(255,45,85,0.12)",
                fontWeight: 700,
              }}
            >
              {profileError}
            </div>
          ) : null}

          {profileMessage ? (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(22,163,74,0.45)",
                background: "rgba(22,163,74,0.12)",
                fontWeight: 700,
              }}
            >
              {profileMessage}
            </div>
          ) : null}

          <button
            type="submit"
            className="btn primary"
            disabled={profileSaving}
            style={{ marginTop: 14 }}
          >
            {profileSaving ? "Saving..." : "Save Profile"}
          </button>
        </form>

        <form className="card" onSubmit={handlePasswordSave}>
          <div className="kicker">Security</div>
          <h2 style={{ marginTop: 6, fontWeight: 950 }}>Change password</h2>

          <label style={{ display: "block", fontWeight: 850, marginTop: 14, marginBottom: 8 }}>
            Current Password
          </label>
          <input
            className="input"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />

          <label style={{ display: "block", fontWeight: 850, marginTop: 14, marginBottom: 8 }}>
            New Password
          </label>
          <input
            className="input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />

          <label style={{ display: "block", fontWeight: 850, marginTop: 14, marginBottom: 8 }}>
            Confirm New Password
          </label>
          <input
            className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />

          {passwordError ? (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,45,85,0.45)",
                background: "rgba(255,45,85,0.12)",
                fontWeight: 700,
              }}
            >
              {passwordError}
            </div>
          ) : null}

          {passwordMessage ? (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(22,163,74,0.45)",
                background: "rgba(22,163,74,0.12)",
                fontWeight: 700,
              }}
            >
              {passwordMessage}
            </div>
          ) : null}

          <button
            type="submit"
            className="btn ghost"
            disabled={passwordSaving}
            style={{ marginTop: 14 }}
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}