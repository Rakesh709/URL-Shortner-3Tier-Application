import { useState } from 'react';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">URL Shortener</h1>
        <div className="space-y-6">
          <UrlForm onUrlCreated={handleUrlCreated} />
          <UrlList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}