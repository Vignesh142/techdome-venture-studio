import { useState, useEffect, useCallback } from 'react';
import { Venture, GlobalSettings, StudioService, EngagementModel } from './types';
import { cmsClient } from './api/cmsClient';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { VentureDetailPage } from './pages/VentureDetailPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  const [globals, setGlobals] = useState<GlobalSettings | null>(null);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [services, setServices] = useState<StudioService[]>([]);
  const [models, setModels] = useState<EngagementModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [globalsData, venturesData, servicesData, modelsData] = await Promise.all([
        cmsClient.getGlobals(),
        cmsClient.getVentures('All'),
        cmsClient.getServices(),
        cmsClient.getEngagementModels(),
      ]);
      setGlobals(globalsData);
      setVentures(venturesData);
      setServices(servicesData);
      setModels(modelsData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error communicating with CMS engine';
      setError(msg);
      console.error('[Techdome Frontend] CMS Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const scrollToContact = useCallback(() => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/#contact');
      setCurrentPath('/');
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  // Route matching
  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin');
  const matchVentureDetail = currentPath.match(/^\/ventures\/([^/]+)/);
  const activeSlug = matchVentureDetail ? matchVentureDetail[1] : null;

  // Render White Theme Admin Studio if on /admin
  if (isAdminRoute) {
    return (
      <AdminPage
        onBackToSite={() => navigate('/')}
        onDataModified={loadData}
      />
    );
  }

  // Render Clean Editorial Studio Public Site
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111111] font-sans antialiased selection:bg-black selection:text-white">
      {/* Universal Header */}
      <Header
        onNavigateHome={() => navigate('/')}
        onOpenAdmin={() => navigate('/admin')}
        onOpenBooking={scrollToContact}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {activeSlug ? (
          <VentureDetailPage
            slug={activeSlug}
            onBack={() => navigate('/')}
            onOpenAdmin={() => navigate('/admin')}
            onOpenBooking={scrollToContact}
          />
        ) : (
          <HomePage
            globals={globals}
            ventures={ventures}
            services={services}
            models={models}
            loading={loading}
            error={error}
            onRetry={loadData}
            onSelectVenture={(slug) => navigate(`/ventures/${slug}`)}
            onOpenAdmin={() => navigate('/admin')}
          />
        )}
      </div>

      {/* Universal Footer */}
      <Footer
        globals={globals}
        onOpenAdmin={() => navigate('/admin')}
      />
    </div>
  );
}

export default App;
