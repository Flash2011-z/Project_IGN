import { authHeader } from "./auth";

const API_BASE = "http://localhost:4000";

async function readJson(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.error || "Request failed.");
  }

  return data;
}

export async function submitCheckout(userId, payload) {
  const normalizedUserId = Number(userId);

  if (!normalizedUserId || Number.isNaN(normalizedUserId)) {
    throw new Error("Valid user id is required.");
  }

  const res = await fetch(`${API_BASE}/checkout/${normalizedUserId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  return readJson(res);
}

export async function fetchOrders(userId) {
  const normalizedUserId = Number(userId);

  if (!normalizedUserId || Number.isNaN(normalizedUserId)) {
    return [];
  }

  const res = await fetch(`${API_BASE}/orders/${normalizedUserId}`, {
    headers: {
      ...authHeader(),
    },
  });

  return readJson(res);
}

export async function fetchSingleOrder(userId, orderId) {
  const normalizedUserId = Number(userId);
  const normalizedOrderId = Number(orderId);

  if (
    !normalizedUserId ||
    Number.isNaN(normalizedUserId) ||
    !normalizedOrderId ||
    Number.isNaN(normalizedOrderId)
  ) {
    throw new Error("Valid user id and order id are required.");
  }

  const res = await fetch(`${API_BASE}/orders/${normalizedUserId}/${normalizedOrderId}`, {
    headers: {
      ...authHeader(),
    },
  });

  return readJson(res);
}