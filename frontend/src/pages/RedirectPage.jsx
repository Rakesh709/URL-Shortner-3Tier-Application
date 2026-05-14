import { useEffect } from 'react';
import { api } from '../services/api';

export default function RedirectPage() {
  useEffect(() => {
    const path = window.location.pathname;
    const shortCode = path.replace('/r/', '');

    if (shortCode) {
      window.location.href = api.getOriginalUrl(shortCode);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}