import { WISHLIST_EVENT, authHeader } from "./auth";

const API_BASE = "http://localhost:4000";

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
  const normalizedUserId = Number(userId);

  if (!normalizedUserId || Number.isNaN(normalizedUserId)) {
    return [];
  }

  const res = await fetch(`${API_BASE}/wishlist/${normalizedUserId}`, {
    headers: {
      ...authHeader(),
    },
  });

  const data = await readJson(res);
  return Array.isArray(data) ? data : [];
}

export async function fetchWishlistIds(userId) {
  const games = await fetchWishlistGames(userId);
  return games
    .map((g) => Number(g?.id))
    .filter((id) => !Number.isNaN(id));
}

export async function addWishlistGame(userId, gameId) {
  const normalizedUserId = Number(userId);
  const normalizedGameId = Number(gameId);

  if (
    !normalizedUserId ||
    Number.isNaN(normalizedUserId) ||
    !normalizedGameId ||
    Number.isNaN(normalizedGameId)
  ) {
    throw new Error("Valid user id and game id are required.");
  }

  const res = await fetch(`${API_BASE}/wishlist/${normalizedUserId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ gameId: normalizedGameId }),
  });

  const data = await readJson(res);
  emitWishlistChanged();
  return data;
}

export async function removeWishlistGame(userId, gameId) {
  const normalizedUserId = Number(userId);
  const normalizedGameId = Number(gameId);

  if (
    !normalizedUserId ||
    Number.isNaN(normalizedUserId) ||
    !normalizedGameId ||
    Number.isNaN(normalizedGameId)
  ) {
    throw new Error("Valid user id and game id are required.");
  }

  const res = await fetch(
    `${API_BASE}/wishlist/${normalizedUserId}/${normalizedGameId}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );

  const data = await readJson(res);
  emitWishlistChanged();
  return data;
}