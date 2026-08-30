const API_BASE = 'http://localhost:5000/api';

export const startCheckout = async (items, userId) => {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, userId }),
  });
  if (!res.ok) throw new Error('Checkout failed');
  const data = await res.json();
  window.location.href = data.url;
};