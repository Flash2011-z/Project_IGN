const API_BASE = "http://localhost:3000";

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
  const res = await fetch(`${API_BASE}/checkout/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readJson(res);
}

export async function fetchOrders(userId) {
  const res = await fetch(`${API_BASE}/orders/${userId}`);
  return readJson(res);
}

export async function fetchSingleOrder(userId, orderId) {
  const res = await fetch(`${API_BASE}/orders/${userId}/${orderId}`);
  return readJson(res);
}