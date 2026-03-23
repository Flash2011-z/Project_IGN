import { CART_EVENT, authHeader } from "./auth";

const API_BASE = "http://localhost:4000";

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
  const normalizedUserId = Number(userId);

  if (!normalizedUserId || Number.isNaN(normalizedUserId)) {
    return {
      items: [],
      total: 0,
      itemCount: 0,
      uniqueCount: 0,
    };
  }

  const res = await fetch(`${API_BASE}/cart/${normalizedUserId}`, {
    headers: {
      ...authHeader(),
    },
  });

  return readJson(res);
}

export async function addCartItem(userId, listingId, quantity = 1) {
  const normalizedUserId = Number(userId);
  const normalizedListingId = Number(listingId);
  const normalizedQuantity = Number(quantity);

  if (
    !normalizedUserId ||
    Number.isNaN(normalizedUserId) ||
    !normalizedListingId ||
    Number.isNaN(normalizedListingId) ||
    !normalizedQuantity ||
    Number.isNaN(normalizedQuantity) ||
    normalizedQuantity < 1
  ) {
    throw new Error("Valid user id, listing id, and quantity are required.");
  }

  const res = await fetch(`${API_BASE}/cart/${normalizedUserId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({
      listingId: normalizedListingId,
      quantity: normalizedQuantity,
    }),
  });

  const data = await readJson(res);
  emitCartChanged();
  return data;
}

export async function updateCartItem(userId, listingId, quantity) {
  const normalizedUserId = Number(userId);
  const normalizedListingId = Number(listingId);
  const normalizedQuantity = Number(quantity);

  if (
    !normalizedUserId ||
    Number.isNaN(normalizedUserId) ||
    !normalizedListingId ||
    Number.isNaN(normalizedListingId) ||
    Number.isNaN(normalizedQuantity)
  ) {
    throw new Error("Valid user id, listing id, and quantity are required.");
  }

  const res = await fetch(
    `${API_BASE}/cart/${normalizedUserId}/${normalizedListingId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify({ quantity: normalizedQuantity }),
    }
  );

  const data = await readJson(res);
  emitCartChanged();
  return data;
}

export async function removeCartItem(userId, listingId) {
  const normalizedUserId = Number(userId);
  const normalizedListingId = Number(listingId);

  if (
    !normalizedUserId ||
    Number.isNaN(normalizedUserId) ||
    !normalizedListingId ||
    Number.isNaN(normalizedListingId)
  ) {
    throw new Error("Valid user id and listing id are required.");
  }

  const res = await fetch(
    `${API_BASE}/cart/${normalizedUserId}/${normalizedListingId}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );

  const data = await readJson(res);
  emitCartChanged();
  return data;
}