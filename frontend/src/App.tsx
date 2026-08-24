import { useState, useEffect, useCallback } from 'react';
import { Venture, GlobalSettings } from './types';
import { cmsClient } from './api/cmsClient';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { VentureDetailPage } from './pages/VentureDetailPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  const [globals, setGlobals] = useState<GlobalSettings | null>(null);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Client router path
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  // Navigation helper
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch all CMS data
  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [globalsData, venturesData] = await Promise.all([
        cmsClient.getGlobals(),
        cmsClient.getVentures('All'),
      ]);
      setGlobals(globalsData);
      setVentures(venturesData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error communicating with CMS engine';
      setError(msg);
      console.error('[Techdome Frontend] CMS Fetch Error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Route matching
  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin');
  const matchVentureDetail = currentPath.match(/^\/ventures\/([^/]+)/);
  const activeSlug = matchVentureDetail ? matchVentureDetail[1] : null;

  // Render White Theme Admin Studio if on /admin
  if (isAdminRoute) {
    return (
      <AdminPage
        onBackToSite={() => navigate('/')}
        onDataModified={() => loadData(true)}
      />
    );
  }

  // Render Crisp White Editorial Studio Public Site
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-black selection:bg-black selection:text-white font-sans antialiased">
      {/* Universal Studio Header */}
      <Header
        onNavigateHome={() => navigate('/')}
        onOpenAdmin={() => navigate('/admin')}
        onRefreshData={() => loadData(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {activeSlug ? (
          <VentureDetailPage
            slug={activeSlug}
            onBack={() => navigate('/')}
            onOpenAdmin={() => navigate('/admin')}
          />
        ) : (
          <HomePage
            globals={globals}
            ventures={ventures}
            loading={loading}
            error={error}
            onRetry={() => loadData(true)}
            onSelectVenture={(slug) => navigate(`/ventures/${slug}`)}
            onOpenAdmin={() => navigate('/admin')}
          />
        )}
      </div>

      {/* Universal Studio Footer */}
      <Footer
        globals={globals}
        onOpenAdmin={() => navigate('/admin')}
      />
    </div>
  );
}

export default App;
