import { useState } from 'react';
import { api } from '../services/api';

export default function UrlForm({ onUrlCreated }) {
  const [url, setUrl] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await api.createShortUrl(
        url,
        expiresInDays ? parseInt(expiresInDays) : null
      );
      setResult(response);
      if (onUrlCreated) onUrlCreated(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`http://localhost:8080${result.shortUrl}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Short URL</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your URL (https://...)"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="number"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            placeholder="Expires in days (optional)"
            min="1"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Short URL:</p>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 bg-white p-2 rounded border text-blue-600">
              {`http://localhost:8080${result.shortUrl}`}
            </code>
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Clicks: {result.clickCount}
          </p>
        </div>
      )}
    </div>
  );
}