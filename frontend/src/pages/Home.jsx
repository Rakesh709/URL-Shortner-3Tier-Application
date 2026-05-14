import { useState } from 'react';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="animated-bg py-12 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            URL Shortener
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Shorten your long URLs instantly. Track clicks. Share easily.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 -mt-6 relative z-20 pb-12">
        <div className="space-y-6 opacity-0 animate-fade-in">
          <UrlForm onUrlCreated={handleUrlCreated} />
        </div>
        <div className="mt-8 opacity-0 animate-fade-in animate-delay-2">
          <UrlList refreshTrigger={refreshTrigger} />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm">
        <p>Built with React & Spring Boot</p>
      </footer>
    </div>
  );
}