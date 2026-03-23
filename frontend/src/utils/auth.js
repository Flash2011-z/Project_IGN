export const AUTH_STORAGE_KEY = "ign_user";
export const TOKEN_STORAGE_KEY = "ign_token";
export const PROFILE_STORAGE_KEY = "ign_profile";

export const AUTH_EVENT = "ign-auth-changed";
export const PROFILE_EVENT = "ign-profile-changed";
export const WISHLIST_EVENT = "ign-wishlist-changed";
export const CART_EVENT = "ign-cart-changed";

function safeParse(raw, fallback = null) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function dispatchWindowEvent(name) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(name));
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  const obj = safeParse(localStorage.getItem(AUTH_STORAGE_KEY), null);
  if (!obj || typeof obj !== "object") return null;

  const id = Number(obj.id ?? obj.user_id ?? null);

  return {
    id: Number.isNaN(id) ? null : id,
    name: String(obj.name ?? obj.username ?? "").trim(),
    email: String(obj.email ?? "").trim(),
    join_date: obj.join_date ?? null,
    avatar_style: String(obj.avatar_style ?? "adventurer").trim() || "adventurer",
    avatar_seed: String(obj.avatar_seed ?? "").trim(),
    bio: String(obj.bio ?? ""),
  };
}

export function setStoredAuth({ user, token }) {
  if (typeof window === "undefined") return null;

  const normalizedId = Number(user?.id ?? user?.user_id ?? null);

  const normalizedUser = {
    id: Number.isNaN(normalizedId) ? null : normalizedId,
    name: String(user?.name ?? user?.username ?? "").trim(),
    email: String(user?.email ?? "").trim(),
    join_date: user?.join_date ?? null,
    avatar_style: String(user?.avatar_style ?? "adventurer").trim() || "adventurer",
    avatar_seed: String(user?.avatar_seed ?? user?.name ?? user?.username ?? "").trim(),
    bio: String(user?.bio ?? ""),
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedUser));

  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify({
      username: normalizedUser.name || "Guest",
      bio: normalizedUser.bio || "",
    })
  );

  dispatchWindowEvent(PROFILE_EVENT);
  dispatchWindowEvent(AUTH_EVENT);

  return normalizedUser;
}

/* keeps old page logic working */
export function setStoredUser(user) {
  const existingToken = getStoredToken();
  return setStoredAuth({
    user,
    token: existingToken,
  });
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  dispatchWindowEvent(AUTH_EVENT);
}

export function authHeader() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isAuthenticated() {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!token && !!user?.id;
}

export function getStoredProfile() {
  if (typeof window === "undefined") {
    return { username: "Guest", bio: "" };
  }

  const user = getStoredUser();
  const obj = safeParse(localStorage.getItem(PROFILE_STORAGE_KEY), null);

  if (!obj || typeof obj !== "object") {
    return {
      username: user?.name || "Guest",
      bio: user?.bio || "",
    };
  }

  return {
    username: String(obj.username || user?.name || "Guest").trim() || "Guest",
    bio: String(obj.bio || user?.bio || "").trim(),
  };
}

export function saveStoredProfile(profile) {
  if (typeof window === "undefined") return null;

  const next = {
    username: String(profile?.username || "Guest").trim() || "Guest",
    bio: String(profile?.bio || "").trim(),
  };

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));

  const user = getStoredUser();
  if (user) {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        ...user,
        name: next.username,
        bio: next.bio,
      })
    );
    dispatchWindowEvent(AUTH_EVENT);
  }

  dispatchWindowEvent(PROFILE_EVENT);
  return next;
}