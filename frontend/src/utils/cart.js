import { CART_EVENT } from "./auth";

const API_BASE = "http://localhost:3000";

function emitCartChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_EVENT));
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
    throw new Error(data?.error || "Cart request failed.");
  }

  return data;
}

export async function fetchCart(userId) {
  if (!userId) {
    return {
      items: [],
      total: 0,
      itemCount: 0,
      uniqueCount: 0,
    };
  }

  const res = await fetch(`${API_BASE}/cart/${userId}`);
  return readJson(res);
}

export async function addCartItem(userId, listingId, quantity = 1) {
  const res = await fetch(`${API_BASE}/cart/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId, quantity }),
  });

  const data = await readJson(res);
  emitCartChanged();
  return data;
}

export async function updateCartItem(userId, listingId, quantity) {
  const res = await fetch(`${API_BASE}/cart/${userId}/${listingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  const data = await readJson(res);
  emitCartChanged();
  return data;
}

export async function removeCartItem(userId, listingId) {
  const res = await fetch(`${API_BASE}/cart/${userId}/${listingId}`, {
    method: "DELETE",
  });

  const data = await readJson(res);
  emitCartChanged();
  return data;
}