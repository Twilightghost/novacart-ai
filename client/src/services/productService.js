const API_BASE = 'http://localhost:5000/api';

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};
export const searchProducts = async (query) => {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
};
export const fetchRecommendations = async (userId) => {
  const res = await fetch(`${API_BASE}/recommendations/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
};