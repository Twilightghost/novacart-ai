const API_BASE = 'http://localhost:5000/api';

export const askAssistant = async (question) => {
  const res = await fetch(`${API_BASE}/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error('Assistant failed to respond');
  return res.json();
};