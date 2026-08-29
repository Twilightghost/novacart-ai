const API_BASE = 'http://localhost:5000/api';

export const logInteraction = async (userId, productId, type) => {
  try {
    await fetch(`${API_BASE}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, type }),
    });
  } catch (error) {
    console.error('Failed to log interaction:', error.message);
  }
};