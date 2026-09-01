const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const syncUserToBackend = async (idToken) => {
  const res = await fetch(`${API_BASE}/users/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) throw new Error('Failed to sync user');
  return res.json();
};