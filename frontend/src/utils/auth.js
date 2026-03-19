export const AUTH_STORAGE_KEY = "ign_user";
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

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  const obj = safeParse(localStorage.getItem(AUTH_STORAGE_KEY), null);
  if (!obj || typeof obj !== "object") return null;

  return {
    id: obj.id ?? obj.user_id ?? null,
    name: typeof obj.name === "string" ? obj.name.trim() : "",
    email: typeof obj.email === "string" ? obj.email.trim() : "",
    join_date: obj.join_date ?? null,
    avatar_style: typeof obj.avatar_style === "string" ? obj.avatar_style.trim() : "",
    avatar_seed: typeof obj.avatar_seed === "string" ? obj.avatar_seed.trim() : "",
    bio: typeof obj.bio === "string" ? obj.bio.trim() : "",
  };
}

export function setStoredUser(user) {
  if (typeof window === "undefined") return null;

  const normalized = {
    id: user?.id ?? user?.user_id ?? null,
    name: String(user?.name ?? user?.username ?? "").trim(),
    email: String(user?.email ?? "").trim(),
    join_date: user?.join_date ?? null,
    avatar_style: String(user?.avatar_style ?? "").trim(),
    avatar_seed: String(user?.avatar_seed ?? "").trim(),
    bio: String(user?.bio ?? "").trim(),
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalized));
  dispatchWindowEvent(AUTH_EVENT);
  return normalized;
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  dispatchWindowEvent(AUTH_EVENT);
}

export function getStoredProfile() {
  if (typeof window === "undefined") return { username: "Guest", bio: "" };

  const user = getStoredUser();

  return {
    username: user?.name || "Guest",
    bio: user?.bio || "",
  };
}

export function saveStoredProfile(profile) {
  if (typeof window === "undefined") return null;

  const user = getStoredUser();
  if (!user) return null;

  const next = {
    ...user,
    name: String(profile?.username || user.name || "Guest").trim(),
    bio: String(profile?.bio || "").trim(),
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
  dispatchWindowEvent(AUTH_EVENT);
  dispatchWindowEvent(PROFILE_EVENT);

  return {
    username: next.name,
    bio: next.bio,
  };
}