import { WISHLIST_EVENT } from "./auth";

const API_BASE = "http://localhost:3000";

function emitWishlistChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(WISHLIST_EVENT));
  }
}

async function readJson(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.error || "Wishlist request failed.");
  }

  return data;
}

export async function fetchWishlistGames(userId) {
  if (!userId) return [];

  const res = await fetch(`${API_BASE}/wishlist/${userId}`);
  const data = await readJson(res);
  return Array.isArray(data) ? data : [];
}

export async function fetchWishlistIds(userId) {
  const games = await fetchWishlistGames(userId);
  return games.map((g) => g.id);
}

export async function addWishlistGame(userId, gameId) {
  const res = await fetch(`${API_BASE}/wishlist/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId }),
  });

  await readJson(res);
  emitWishlistChanged();
}

export async function removeWishlistGame(userId, gameId) {
  const res = await fetch(`${API_BASE}/wishlist/${userId}/${gameId}`, {
    method: "DELETE",
  });

  await readJson(res);
  emitWishlistChanged();
}