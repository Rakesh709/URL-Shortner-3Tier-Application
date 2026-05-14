import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function UrlList({ refreshTrigger }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const data = await api.getAllUrls();
      setUrls(data);
    } catch (err) {
      setError('Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [refreshTrigger]);

  const handleDelete = async (shortCode) => {
    if (!confirm('Delete this URL?')) return;
    try {
      await api.deleteUrl(shortCode);
      fetchUrls();
    } catch (err) {
      alert('Failed to delete URL');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  if (loading && urls.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">All URLs</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {urls.length === 0 ? (
        <p className="text-gray-500">No URLs created yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2">Short Code</th>
                <th className="py-2 px-2">Original URL</th>
                <th className="py-2 px-2">Clicks</th>
                <th className="py-2 px-2">Created</th>
                <th className="py-2 px-2">Expires</th>
                <th className="py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">
                    <span className="text-blue-600 font-mono">{url.shortCode}</span>
                  </td>
                  <td className="py-2 px-2 max-w-xs truncate" title={url.originalUrl}>
                    {url.originalUrl}
                  </td>
                  <td className="py-2 px-2">{url.clickCount}</td>
                  <td className="py-2 px-2 text-sm">{formatDate(url.createdAt)}</td>
                  <td className="py-2 px-2 text-sm">{formatDate(url.expiresAt)}</td>
                  <td className="py-2 px-2">
                    <button
                      onClick={() => handleDelete(url.shortCode)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}