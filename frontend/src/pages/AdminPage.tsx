import React, { useState, useEffect } from 'react';
import { Venture, GlobalSettings, VentureStage } from '../types';
import { cmsClient } from '../api/cmsClient';
import {
  Layers,
  Settings,
  Code,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Search,
  Shield,
  Activity,
  Network,
  Cpu,
  Database,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronRight,
  X,
  SlidersHorizontal,
  Menu,
  FileText,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  LogOut,
  KeyRound
} from 'lucide-react';

interface AdminPageProps {
  onBackToSite: () => void;
  onDataModified: () => void;
}

const ADMIN_PASSWORD = 'Techdome';

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToSite, onDataModified }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('techdome_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Studio Dashboard states
  const [activeTab, setActiveTab] = useState<'ventures' | 'globals' | 'api'>('ventures');
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [globals, setGlobals] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Big Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingVenture, setEditingVenture] = useState<Partial<Venture> | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState<boolean>(false);
  const [autoSlug, setAutoSlug] = useState<boolean>(true);

  // Globals form state
  const [globalsForm, setGlobalsForm] = useState<Partial<GlobalSettings>>({});
  const [isSavingGlobals, setIsSavingGlobals] = useState<boolean>(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      if (passwordInput === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        sessionStorage.setItem('techdome_admin_auth', 'true');
        showToast('Authenticated successfully. Welcome to Studio CMS!');
      } else {
        setAuthError('Incorrect studio access key. Try "Techdome".');
        setIsLoggingIn(false);
      }
    }, 350);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('techdome_admin_auth');
    setPasswordInput('');
    showToast('Studio locked successfully');
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [venturesData, globalsData] = await Promise.all([
        cmsClient.getVentures('All', true),
        cmsClient.getGlobals(),
      ]);
      setVentures(venturesData);
      setGlobals(globalsData);
      setGlobalsForm(globalsData);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load CMS data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleOpenModal = (venture?: Venture) => {
    setIsSaveSuccess(false);
    if (venture) {
      setEditingVenture({ ...venture });
      setAutoSlug(false);
    } else {
      setEditingVenture({
        name: '',
        slug: '',
        tagline: '',
        one_liner: '',
        stage: 'Building',
        year: new Date().getFullYear().toString(),
        metrics: '',
        founders: 'Techdome Venture Studio',
        website_url: 'https://techdome.net.in',
        image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        image_symbol: 'shield',
        accent_pattern: 'mesh',
        description: '',
        published: true,
      });
      setAutoSlug(true);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVenture(null);
    setIsSaving(false);
    setIsSaveSuccess(false);
  };

  const handleTogglePublish = async (venture: Venture, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newStatus = !venture.published;
      await cmsClient.updateVenture(venture.id, { published: newStatus });
      setVentures(prev => prev.map(v => v.id === venture.id ? { ...v, published: newStatus } : v));
      showToast(`${venture.name} ${newStatus ? 'published live' : 'set to draft'}`);
      onDataModified();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveVenture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenture?.name) {
      showToast('Venture name is required', 'error');
      return;
    }

    setIsSaving(true);
    setIsSaveSuccess(false);
    try {
      if (editingVenture.id) {
        await cmsClient.updateVenture(editingVenture.id, editingVenture);
        setIsSaveSuccess(true);
        showToast(`Updated "${editingVenture.name}" in database!`);
      } else {
        await cmsClient.createVenture(editingVenture);
        setIsSaveSuccess(true);
        showToast(`Created "${editingVenture.name}" in database!`);
      }

      setTimeout(async () => {
        handleCloseModal();
        await loadAllData();
        onDataModified();
      }, 400);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save venture', 'error');
      setIsSaving(false);
    }
  };

  const handleDeleteVenture = async (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete venture "${name}"?`)) return;
    try {
      await cmsClient.deleteVenture(id);
      showToast(`Deleted "${name}"`);
      await loadAllData();
      onDataModified();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete', 'error');
    }
  };

  const handleSaveGlobals = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGlobals(true);
    try {
      const updated = await cmsClient.updateGlobals(globalsForm);
      setGlobals(updated);
      showToast('Global studio settings saved successfully!');
      onDataModified();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save globals', 'error');
    } finally {
      setIsSavingGlobals(false);
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset all CMS content back to initial seed data?')) return;
    try {
      await cmsClient.resetSeed();
      showToast('CMS Database reset to default seed!');
      await loadAllData();
      onDataModified();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to reset seed', 'error');
    }
  };

  const handleCopyEndpoint = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedEndpoint(url);
    setTimeout(() => setCopiedEndpoint(null), 2000);
    showToast('Copied endpoint URL to clipboard');
  };

  // IF NOT AUTHENTICATED: SHOW SLEEK LOGIN SCREEN WITH LOGO
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between p-6 sm:p-10 font-sans text-black relative overflow-hidden selection:bg-black selection:text-white">
        {/* Background Architectural Grid */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Top bar back button */}
        <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
          <button
            onClick={onBackToSite}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-black transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Studio</span>
          </button>

          <span className="text-xs font-mono text-neutral-400">
            Local Port · 1337
          </span>
        </div>

        {/* Centered Login Card */}
        <div className="relative z-10 w-full max-w-md mx-auto my-auto animate-in zoom-in-95 fade-in duration-300">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl">
            {/* Studio Official Logo Branding */}
            <div className="flex flex-col items-center text-center mb-8">
              <img
                src="/techdome.png"
                alt="Techdome Official Logo"
                className="h-12 w-auto object-contain mb-4"
              />
              <h2 className="font-display font-bold text-2xl text-black tracking-tight">
                Techdome CMS Studio
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-1 max-w-xs leading-relaxed">
                Institutional Content Management System. Enter access key to proceed.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                  Studio Password Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 text-sm font-sans text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-neutral-400 hover:text-black absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <p className="text-xs text-red-600 font-mono mt-2 flex items-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{authError}</span>
                  </p>
                )}
              </div>

              {/* Quick Hint Card */}
              <div 
                onClick={() => setPasswordInput('Techdome')}
                className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/80 text-[11px] font-mono text-neutral-600 flex items-center justify-between cursor-pointer transition-colors"
                title="Click to autofill"
              >
                <span>Default Access Key: <strong className="text-black">Techdome</strong></span>
                <span className="text-[10px] text-neutral-400 font-semibold underline">Autofill</span>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Access...</span>
                  </>
                ) : (
                  <span>Unlock CMS Studio →</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center text-xs font-mono text-neutral-400">
          © {new Date().getFullYear()} Techdome Labs · Studio CMS Security Guard
        </div>
      </div>
    );
  }

  const stats = {
    total: ventures.length,
    launched: ventures.filter(v => v.stage === 'Launched').length,
    building: ventures.filter(v => v.stage === 'Building').length,
    exited: ventures.filter(v => v.stage === 'Exited').length,
    published: ventures.filter(v => v.published !== false).length,
  };

  const filteredVentures = ventures.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.tagline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'All' || v.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="h-screen w-full bg-[#FBFBFB] text-black font-sans flex flex-col md:flex-row overflow-hidden antialiased selection:bg-black selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-black text-white border-black'
                : 'bg-red-600 text-white border-red-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-white shrink-0 animate-in zoom-in-50" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* MOBILE TOP BAR WITH LOGO */}
      <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/techdome.png" alt="Techdome" className="h-7 w-auto object-contain" />
          <span className="font-display font-bold text-base text-black">Techdome CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="p-2 rounded-lg bg-black text-white text-xs"
            title="Add Venture"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-neutral-200 text-black"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* FULL-HEIGHT LEFT SIDEBAR WITH OFFICIAL LOGO */}
      <aside
        className={`w-72 shrink-0 bg-white border-r border-neutral-200 flex flex-col justify-between p-6 z-40 transition-transform duration-300 ease-out absolute md:static inset-y-0 left-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Official Brand Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-100 mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/techdome.png"
                alt="Techdome Official Logo"
                className="h-8 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-tight text-black">
                  Techdome CMS
                </span>
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  Headless Studio
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono font-semibold uppercase text-neutral-400 px-3 mb-2 tracking-wider">
              Management
            </div>

            <button
              onClick={() => {
                setActiveTab('ventures');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeTab === 'ventures'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Ventures Model</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'ventures' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {ventures.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('globals');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeTab === 'globals'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Global Settings</span>
              </div>
              <span className="text-[10px] font-mono font-semibold">CMS</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('api');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeTab === 'api'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4" />
                <span>REST Endpoints</span>
              </div>
              <span className="text-[10px] font-mono">JSON</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer with Logout Lock button */}
        <div className="pt-6 border-t border-neutral-100 space-y-2.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 text-xs font-mono transition-colors"
            title="Lock studio and return to login"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Studio</span>
            </div>
            <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500">Active</span>
          </button>

          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-center gap-2 text-xs font-mono font-semibold text-black bg-neutral-100 hover:bg-neutral-200 py-3 px-4 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Public Site</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Header */}
        <header className="h-20 bg-white border-b border-neutral-200 px-6 sm:px-10 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-black">
              {activeTab === 'ventures' && 'Portfolio Ventures'}
              {activeTab === 'globals' && 'Global Studio Settings'}
              {activeTab === 'api' && 'REST API Documentation'}
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              {activeTab === 'ventures' && 'Manage all ventures, stages, metrics, and content models'}
              {activeTab === 'globals' && 'Edit hero headline, subline, metrics, and manifesto statements'}
              {activeTab === 'api' && 'Real-time JSON endpoints served from the local backend'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetSeed}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-black text-xs font-mono font-medium transition-all"
              title="Reset content to initial seed"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
              <span>Reset Seed</span>
            </button>

            {activeTab === 'ventures' && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Venture</span>
              </button>
            )}

            {activeTab === 'globals' && (
              <button
                onClick={handleSaveGlobals}
                disabled={isSavingGlobals}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm disabled:opacity-70"
              >
                {isSavingGlobals ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSavingGlobals ? 'Saving Changes...' : 'Save Settings'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Body with Subtle Fade-In */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-8 animate-in fade-in duration-300">
          {/* TAB 1: VENTURES */}
          {activeTab === 'ventures' && (
            <div className="space-y-6 max-w-7xl">
              {/* Top Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                    Total Portfolio
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold font-display text-black">{stats.total}</span>
                    <span className="text-xs text-neutral-500 font-mono">Ventures</span>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                    Launched
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold font-display text-black">{stats.launched}</span>
                    <span className="text-xs text-neutral-600 font-mono">Active</span>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                    Building
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold font-display text-black">{stats.building}</span>
                    <span className="text-xs text-neutral-600 font-mono">Incubation</span>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                    Exited
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold font-display text-black">{stats.exited}</span>
                    <span className="text-xs text-neutral-600 font-mono">Acquired</span>
                  </div>
                </div>
              </div>

              {/* Filter, Search & View Controls */}
              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by venture name, slug, tagline..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-sans text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Stage filter pills */}
                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                    {['All', 'Launched', 'Building', 'Exited'].map((stg) => (
                      <button
                        key={stg}
                        onClick={() => setSelectedStage(stg)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                          selectedStage === stg
                            ? 'bg-black text-white font-semibold shadow-xs'
                            : 'text-neutral-600 hover:text-black'
                        }`}
                      >
                        {stg}
                      </button>
                    ))}
                  </div>

                  <div className="h-5 w-px bg-neutral-200 hidden sm:block" />

                  <button
                    onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                    className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-black text-xs font-mono flex items-center gap-1.5 transition-colors"
                    title="Toggle List / Grid view"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{viewMode === 'list' ? 'Grid' : 'List'}</span>
                  </button>
                </div>
              </div>

              {/* Ventures List */}
              {loading ? (
                <div className="py-24 text-center text-neutral-400 font-mono text-xs bg-white rounded-2xl border border-neutral-200">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-black" />
                  Loading portfolio records from database...
                </div>
              ) : filteredVentures.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs font-mono">
                  No ventures match "{searchQuery}" in stage "{selectedStage}".
                </div>
              ) : viewMode === 'list' ? (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden divide-y divide-neutral-100">
                  {filteredVentures.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => handleOpenModal(v)}
                      className="p-5 sm:p-6 hover:bg-neutral-50/80 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        {/* Square Emblem / Image Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300 mt-0.5 sm:mt-0">
                          {v.image_url ? (
                            <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                          ) : v.image_symbol === 'shield' ? (
                            <Shield className="w-5 h-5" />
                          ) : v.image_symbol === 'network' ? (
                            <Network className="w-5 h-5" />
                          ) : v.image_symbol === 'activity' ? (
                            <Activity className="w-5 h-5" />
                          ) : v.image_symbol === 'cpu' ? (
                            <Cpu className="w-5 h-5" />
                          ) : v.image_symbol === 'database' ? (
                            <Database className="w-5 h-5" />
                          ) : (
                            <Layers className="w-5 h-5" />
                          )}
                        </div>

                        {/* NAME BIG & SLUG SMALLER BELOW */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-display font-bold text-lg sm:text-xl text-black tracking-tight truncate group-hover:text-neutral-700 transition-colors">
                              {v.name}
                            </h3>
                            <span
                              className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                                v.stage === 'Launched'
                                  ? 'bg-black text-white'
                                  : v.stage === 'Building'
                                  ? 'bg-neutral-100 text-black border border-neutral-300'
                                  : 'bg-transparent text-neutral-500 border border-neutral-300 border-dashed'
                              }`}
                            >
                              {v.stage}
                            </span>
                          </div>

                          {/* Slug Smaller Below */}
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-mono text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                              /ventures/{v.slug}
                            </span>
                            {v.tagline && (
                              <span className="text-xs text-neutral-400 truncate hidden md:inline">
                                • {v.tagline}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-neutral-600 truncate max-w-2xl font-normal leading-relaxed">
                            {v.one_liner}
                          </p>
                        </div>
                      </div>

                      {/* Right Meta & Actions */}
                      <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                        <div className="text-right hidden md:block">
                          <div className="text-xs font-semibold text-black font-mono">{v.metrics || 'Pre-Seed'}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">Est. {v.year || '2024'}</div>
                        </div>

                        {/* Status Toggle */}
                        <button
                          onClick={(e) => handleTogglePublish(v, e)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 active:scale-95 ${
                            v.published !== false
                              ? 'bg-black text-white hover:bg-neutral-800'
                              : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {v.published !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{v.published !== false ? 'Live' : 'Draft'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(v);
                          }}
                          className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-black text-xs font-mono transition-colors active:scale-95"
                          title="Edit venture"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => handleDeleteVenture(v.id, v.name, e)}
                          className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors active:scale-95"
                          title="Delete venture"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVentures.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => handleOpenModal(v)}
                      className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs hover:border-black hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                              v.stage === 'Launched'
                                ? 'bg-black text-white'
                                : v.stage === 'Building'
                                ? 'bg-neutral-100 text-black border border-neutral-300'
                                : 'bg-transparent text-neutral-500 border border-neutral-300 border-dashed'
                            }`}
                          >
                            {v.stage}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">/{v.slug}</span>
                        </div>

                        <h3 className="font-bold font-display text-black text-xl mb-1">{v.name}</h3>
                        <div className="text-xs font-mono text-neutral-400 mb-3">/ventures/{v.slug}</div>
                        <p className="text-xs text-neutral-600 line-clamp-2 mb-6 leading-relaxed font-normal">{v.one_liner}</p>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-black">{v.metrics || 'Pre-Seed'}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(v);
                            }}
                            className="p-1.5 rounded text-black hover:bg-neutral-100"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GLOBALS SETTINGS */}
          {activeTab === 'globals' && (
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-2xs max-w-5xl">
              <div className="pb-6 border-b border-neutral-100 mb-8">
                <h2 className="font-display font-bold text-xl text-black">Studio Copy & Hero Positioning</h2>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  100% dynamic CMS driven statements and metrics.
                </p>
              </div>

              <form onSubmit={handleSaveGlobals} className="space-y-8">
                {/* Hero Section */}
                <div className="space-y-5">
                  <span className="text-xs font-mono font-semibold uppercase text-neutral-400 tracking-wider block">
                    Hero Statements
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                        Studio Name
                      </label>
                      <input
                        type="text"
                        value={globalsForm.studio_name || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, studio_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-sans text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                        Hero Eyebrow Category
                      </label>
                      <input
                        type="text"
                        value={globalsForm.hero_eyebrow || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, hero_eyebrow: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-sans text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Hero Primary Headline
                    </label>
                    <input
                      type="text"
                      value={globalsForm.hero_headline || ''}
                      onChange={(e) => setGlobalsForm({ ...globalsForm, hero_headline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-sans text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none font-semibold transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Hero Subline Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={globalsForm.hero_subline || ''}
                      onChange={(e) => setGlobalsForm({ ...globalsForm, hero_subline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-sans text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none leading-relaxed transition-all"
                    />
                  </div>
                </div>

                {/* Studio Metrics */}
                <div className="pt-6 border-t border-neutral-100">
                  <span className="text-xs font-mono font-semibold uppercase text-neutral-400 tracking-wider block mb-4">
                    Studio Key Traction Metrics
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Metric 1</label>
                      <input
                        type="text"
                        placeholder="Value (e.g. 6)"
                        value={globalsForm.stats_metric_1_val || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_metric_1_val: e.target.value })}
                        className="w-full px-3 py-2 mb-2 rounded-lg border border-neutral-200 text-sm bg-white font-bold font-mono text-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Label"
                        value={globalsForm.stats_metric_1_label || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_metric_1_label: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Metric 2</label>
                      <input
                        type="text"
                        placeholder="Value (e.g. $28M+)"
                        value={globalsForm.stats_metric_2_val || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_metric_2_val: e.target.value })}
                        className="w-full px-3 py-2 mb-2 rounded-lg border border-neutral-200 text-sm bg-white font-bold font-mono text-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Label"
                        value={globalsForm.stats_metric_2_label || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_metric_2_label: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Metric 3</label>
                      <input
                        type="text"
                        placeholder="Value (e.g. 100%)"
                        value={globalsForm.stats_metric_3_val || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_metric_3_val: e.target.value })}
                        className="w-full px-3 py-2 mb-2 rounded-lg border border-neutral-200 text-sm bg-white font-bold font-mono text-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Label"
                        value={globalsForm.stats_metric_3_label || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_metric_3_label: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Manifesto & Contact */}
                <div className="pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Studio Manifesto Quote
                    </label>
                    <textarea
                      rows={3}
                      value={globalsForm.manifesto_quote || ''}
                      onChange={(e) => setGlobalsForm({ ...globalsForm, manifesto_quote: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-sans text-black leading-relaxed focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={globalsForm.contact_email || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, contact_email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">
                        Studio Location
                      </label>
                      <input
                        type="text"
                        value={globalsForm.location || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, location: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingGlobals}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white text-xs font-mono font-semibold hover:bg-neutral-800 transition-all shadow-sm disabled:opacity-70 active:scale-95"
                  >
                    {isSavingGlobals ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isSavingGlobals ? 'Saving Changes...' : 'Save Global Settings'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: API ENDPOINTS */}
          {activeTab === 'api' && (
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-2xs max-w-5xl space-y-6">
              <div>
                <h2 className="font-display font-bold text-xl text-black">REST API Live Endpoints</h2>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  Active local API endpoints backing the Techdome Studio slice.
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  { method: 'GET', path: '/api/ventures', desc: 'Returns all published ventures (supports ?stage= & ?drafts=true)' },
                  { method: 'GET', path: '/api/ventures/:slug', desc: 'Returns single venture object by slug or integer ID' },
                  { method: 'POST', path: '/api/ventures', desc: 'Creates a new venture in SQLite engine' },
                  { method: 'PUT', path: '/api/ventures/:id', desc: 'Updates venture fields (used during Acid Test)' },
                  { method: 'GET', path: '/api/globals', desc: 'Returns studio hero statements, metrics, and contact metadata' },
                  { method: 'GET', path: '/api/health', desc: 'Uptime, version, and database record health' },
                ].map((ep) => (
                  <div
                    key={ep.path}
                    className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-black text-white">
                        {ep.method}
                      </span>
                      <code className="font-mono text-xs font-semibold text-black truncate">
                        {ep.path}
                      </code>
                      <span className="text-xs text-neutral-500 hidden lg:inline">
                        — {ep.desc}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleCopyEndpoint(`http://localhost:1337${ep.path.replace(':slug', 'kiteflow-ai').replace(':id', '1')}`)}
                        className="p-2 rounded-lg hover:bg-neutral-200 text-neutral-600 hover:text-black transition-colors"
                        title="Copy endpoint URL"
                      >
                        {copiedEndpoint?.includes(ep.path) ? (
                          <Check className="w-4 h-4 text-black" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <a
                        href={`http://localhost:1337${ep.path.replace(':slug', 'kiteflow-ai').replace(':id', '1')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-black font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-white bg-white shadow-2xs transition-all"
                      >
                        <span>Open JSON</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* GRAND WIDE & TALL POPUP MODAL FOR ADDING / EDITING VENTURE */}
      {isModalOpen && editingVenture && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-neutral-200 flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-sm transition-transform duration-300">
                  {editingVenture.image_symbol === 'shield' && <Shield className="w-6 h-6" />}
                  {editingVenture.image_symbol === 'network' && <Network className="w-6 h-6" />}
                  {editingVenture.image_symbol === 'activity' && <Activity className="w-6 h-6" />}
                  {editingVenture.image_symbol === 'cpu' && <Cpu className="w-6 h-6" />}
                  {editingVenture.image_symbol === 'database' && <Database className="w-6 h-6" />}
                  {(!editingVenture.image_symbol || !['shield', 'network', 'activity', 'cpu', 'database'].includes(editingVenture.image_symbol)) && (
                    <Layers className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-0.5 font-semibold">
                    CMS Content Modeling
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-black">
                    {editingVenture.id ? `Edit Venture: ${editingVenture.name}` : 'Create New Portfolio Venture'}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="p-2.5 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors disabled:opacity-50"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form with Clean Card Panels */}
            <form id="venture-modal-form" onSubmit={handleSaveVenture} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-[#FAFAFA]">
              {/* Card Panel 1: Core Identity */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black tracking-wider pb-3 border-b border-neutral-100">
                  <FileText className="w-3.5 h-3.5 text-black" />
                  <span>01 / Core Identity & Routing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Venture Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingVenture.name || ''}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = autoSlug
                          ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                          : editingVenture.slug;
                        setEditingVenture({ ...editingVenture, name, slug });
                      }}
                      placeholder="e.g. Kiteflow AI"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-mono font-semibold text-neutral-700">
                        URL Slug *
                      </label>
                      <span className="text-[10px] font-mono text-neutral-400">Route: /ventures/:slug</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={editingVenture.slug || ''}
                      onChange={(e) => {
                        setAutoSlug(false);
                        setEditingVenture({ ...editingVenture, slug: e.target.value });
                      }}
                      placeholder="e.g. kiteflow-ai"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-mono text-black bg-neutral-50/60 focus:bg-white focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Stage Enum *
                    </label>
                    <select
                      value={editingVenture.stage || 'Building'}
                      onChange={(e) => setEditingVenture({ ...editingVenture, stage: e.target.value as VentureStage })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-mono text-black bg-white focus:ring-2 focus:ring-black focus:border-black focus:outline-none font-semibold transition-all"
                    >
                      <option value="Building">Building (Incubation)</option>
                      <option value="Launched">Launched (Active Scale)</option>
                      <option value="Exited">Exited (Acquired / IPO)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Category Tagline
                    </label>
                    <input
                      type="text"
                      value={editingVenture.tagline || ''}
                      onChange={(e) => setEditingVenture({ ...editingVenture, tagline: e.target.value })}
                      placeholder="e.g. Autonomous Cloud Security & Compliance"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Card Panel 2: Studio Positioning & Metrics */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black tracking-wider pb-3 border-b border-neutral-100">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>02 / Studio Positioning & Traction</span>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                    One-Liner Value Proposition *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVenture.one_liner || ''}
                    onChange={(e) => setEditingVenture({ ...editingVenture, one_liner: e.target.value })}
                    placeholder="Sharp 1-sentence value proposition displayed on portfolio card"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Traction / Capital Raised
                    </label>
                    <input
                      type="text"
                      value={editingVenture.metrics || ''}
                      onChange={(e) => setEditingVenture({ ...editingVenture, metrics: e.target.value })}
                      placeholder="e.g. $2.4M Seed · 140+ Customers"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Year Founded
                    </label>
                    <input
                      type="text"
                      value={editingVenture.year || ''}
                      onChange={(e) => setEditingVenture({ ...editingVenture, year: e.target.value })}
                      placeholder="2024"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Founding Team
                    </label>
                    <input
                      type="text"
                      value={editingVenture.founders || ''}
                      onChange={(e) => setEditingVenture({ ...editingVenture, founders: e.target.value })}
                      placeholder="e.g. Karan S. & Techdome Studio"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                    Live Product Website URL
                  </label>
                  <input
                    type="url"
                    value={editingVenture.website_url || ''}
                    onChange={(e) => setEditingVenture({ ...editingVenture, website_url: e.target.value })}
                    placeholder="https://venture.techdome.net.in"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white"
                  />
                </div>
              </div>

              {/* Card Panel 3: Visual Assets & Real Image */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black tracking-wider pb-3 border-b border-neutral-100">
                  <ImageIcon className="w-3.5 h-3.5 text-black" />
                  <span>03 / Visual Media & Emblems</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Real Image URL (Unsplash or custom URL)
                    </label>
                    <input
                      type="url"
                      value={editingVenture.image_url || ''}
                      onChange={(e) => setEditingVenture({ ...editingVenture, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white mb-2"
                    />
                    <span className="text-[11px] font-mono text-neutral-400 block">
                      Leave empty to automatically render our generative animated blueprint!
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                      Fallback Emblem
                    </label>
                    <select
                      value={editingVenture.image_symbol || 'shield'}
                      onChange={(e) => setEditingVenture({ ...editingVenture, image_symbol: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white font-mono text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                    >
                      <option value="shield">Shield (Security)</option>
                      <option value="network">Network (Graph & AI)</option>
                      <option value="activity">Activity (Telemetry)</option>
                      <option value="cpu">CPU (Systems)</option>
                      <option value="database">Database (Storage)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card Panel 4: Full Editorial Thesis & Publishing */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black tracking-wider pb-3 border-b border-neutral-100">
                  <FileText className="w-3.5 h-3.5 text-black" />
                  <span>04 / Editorial Market Thesis & Live Publishing</span>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                    Full Venture Thesis (Multi-paragraph description) *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={editingVenture.description || ''}
                    onChange={(e) => setEditingVenture({ ...editingVenture, description: e.target.value })}
                    placeholder="Comprehensive multi-paragraph breakdown of the problem, studio thesis, tech stack, and customer traction..."
                    className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 text-xs font-sans text-black leading-relaxed focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all bg-neutral-50/60 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="modal-published"
                      checked={editingVenture.published !== false}
                      onChange={(e) => setEditingVenture({ ...editingVenture, published: e.target.checked })}
                      className="w-5 h-5 rounded accent-black cursor-pointer"
                    />
                    <div>
                      <label htmlFor="modal-published" className="text-xs font-bold text-black cursor-pointer block">
                        Publish on Live Website
                      </label>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        When unchecked, saved as draft and hidden from public portfolio.
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-full ${
                      editingVenture.published !== false ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {editingVenture.published !== false ? 'Will Publish' : 'Will Draft'}
                  </span>
                </div>
              </div>
            </form>

            {/* Modal Sticky Footer with Animated Save State */}
            <div className="p-6 sm:p-8 border-t border-neutral-100 bg-white flex items-center justify-between gap-4 shrink-0">
              <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
                {isSaving ? 'Writing to SQLite store...' : isSaveSuccess ? 'Saved successfully!' : 'Instant persistence on save'}
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-mono font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="venture-modal-form"
                  disabled={isSaving}
                  className="px-7 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all duration-200 shadow-sm flex items-center gap-2 disabled:opacity-75 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Changes...</span>
                    </>
                  ) : isSaveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in-50" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Venture</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
