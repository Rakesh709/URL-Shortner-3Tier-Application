const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  createShortUrl: async (url, expiresInDays = null) => {
    const response = await fetch(`${API_BASE_URL}/urls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalUrl: url,
        expiresInDays
      })
    });
    if (!response.ok) throw new Error('Failed to create short URL');
    return response.json();
  },

  getAllUrls: async () => {
    const response = await fetch(`${API_BASE_URL}/urls`);
    if (!response.ok) throw new Error('Failed to fetch URLs');
    return response.json();
  },

  getUrl: async (shortCode) => {
    const response = await fetch(`${API_BASE_URL}/urls/${shortCode}`);
    if (!response.ok) throw new Error('URL not found');
    return response.json();
  },

  deleteUrl: async (shortCode) => {
    const response = await fetch(`${API_BASE_URL}/urls/${shortCode}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete URL');
  },

  getOriginalUrl: (shortCode) => {
    return `${API_BASE_URL}/urls/redirect/${shortCode}`;
  }
};