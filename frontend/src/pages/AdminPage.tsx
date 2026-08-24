import React, { useState, useEffect } from 'react';
import { Venture, GlobalSettings, ClientInquiry, StudioService, EngagementModel, VentureStage } from '../types';
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
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  X,
  Menu,
  FileText,
  Sparkles,
  Loader2,
  LogOut,
  KeyRound,
  Inbox,
  Mail,
  Building2,
  MessageSquare,
  Briefcase,
  Zap
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
  const [activeTab, setActiveTab] = useState<'ventures' | 'inquiries' | 'services' | 'globals' | 'api'>('ventures');
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [services, setServices] = useState<StudioService[]>([]);
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [globals, setGlobals] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedInquiryStatus, setSelectedInquiryStatus] = useState<string>('All');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Big Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingVenture, setEditingVenture] = useState<Partial<Venture> | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [autoSlug, setAutoSlug] = useState<boolean>(true);

  // Globals form state
  const [globalsForm, setGlobalsForm] = useState<Partial<GlobalSettings>>({});
  const [isSavingGlobals, setIsSavingGlobals] = useState<boolean>(false);

  // Services & Models editing state
  const [savingServiceId, setSavingServiceId] = useState<number | null>(null);
  const [savingModelId, setSavingModelId] = useState<number | null>(null);

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
      const [venturesData, globalsData, inquiriesData, servicesData, modelsData] = await Promise.all([
        cmsClient.getVentures('All', true),
        cmsClient.getGlobals(),
        cmsClient.getInquiries(),
        cmsClient.getServices(),
        cmsClient.getEngagementModels(),
      ]);
      setVentures(venturesData);
      setGlobals(globalsData);
      setGlobalsForm(globalsData);
      setInquiries(inquiriesData);
      setServices(servicesData);
      setEngagementModels(modelsData);
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
        image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
        image_symbol: 'shield',
        accent_pattern: 'mesh',
        tech_stack: ['TypeScript', 'Python', 'AWS'],
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
    try {
      if (editingVenture.id) {
        await cmsClient.updateVenture(editingVenture.id, editingVenture);
        showToast(`Updated "${editingVenture.name}" in database!`);
      } else {
        await cmsClient.createVenture(editingVenture);
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

  const handleUpdateInquiryStatus = async (id: number, newStatus: string) => {
    try {
      await cmsClient.updateInquiry(id, { status: newStatus });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      showToast(`Lead status updated to ${newStatus}`);
    } catch {
      showToast('Failed to update lead status', 'error');
    }
  };

  const handleDeleteInquiry = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this client inquiry record?')) return;
    try {
      await cmsClient.deleteInquiry(id);
      setInquiries(prev => prev.filter(i => i.id !== id));
      showToast('Inquiry record deleted');
    } catch {
      showToast('Failed to delete inquiry', 'error');
    }
  };

  const handleSaveService = async (service: StudioService) => {
    setSavingServiceId(service.id);
    try {
      await cmsClient.updateService(service.id, service);
      showToast(`Saved "${service.title}" practice area!`);
      onDataModified();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save service', 'error');
    } finally {
      setSavingServiceId(null);
    }
  };

  const handleSaveEngagementModel = async (model: EngagementModel) => {
    setSavingModelId(model.id);
    try {
      await cmsClient.updateEngagementModel(model.id, model);
      showToast(`Saved "${model.title}" engagement model!`);
      onDataModified();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save model', 'error');
    } finally {
      setSavingModelId(null);
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

  // IF NOT AUTHENTICATED: SHOW SLEEK LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between p-4 sm:p-10 font-sans text-black relative overflow-hidden selection:bg-black selection:text-white">
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

        <div className="relative z-10 w-full max-w-md mx-auto my-auto animate-in zoom-in-95 fade-in duration-300">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl">
            <div className="flex flex-col items-center text-center mb-8">
              <img
                src="/techdome.png"
                alt="Techdome"
                className="h-9 sm:h-10 w-auto object-contain mb-3"
              />
              <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                Studio CMS Engine
              </span>
              <p className="text-xs text-neutral-500 font-mono mt-2 max-w-xs leading-relaxed">
                Institutional Content Management & Lead CRM. Enter access key to proceed.
              </p>
            </div>

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
                className="w-full py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
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

        <div className="relative z-10 text-center text-xs font-mono text-neutral-400">
          © {new Date().getFullYear()} Techdome Labs · Studio CMS Security Guard
        </div>
      </div>
    );
  }

  const stats = {
    totalVentures: ventures.length,
    inquiriesTotal: inquiries.length,
    inquiriesNew: inquiries.filter(i => i.status === 'New').length,
    publishedVentures: ventures.filter(v => v.published !== false).length,
  };

  const filteredVentures = ventures.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.tagline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'All' || v.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const filteredInquiries = inquiries.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.project_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedInquiryStatus === 'All' || i.status.toLowerCase() === selectedInquiryStatus.toLowerCase();
    return matchesSearch && matchesStatus;
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

      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/techdome.png" alt="Techdome" className="h-6 w-auto object-contain" />
          <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest pl-2 border-l border-neutral-300 font-semibold">CMS</span>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'ventures' && (
            <button
              onClick={() => handleOpenModal()}
              className="p-2 rounded-lg bg-black text-white text-xs"
              title="Add Venture"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-neutral-200 text-black"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* FULL-HEIGHT LEFT SIDEBAR */}
      <aside
        className={`w-72 shrink-0 bg-white border-r border-neutral-200 flex flex-col justify-between p-6 z-40 transition-transform duration-300 ease-out fixed md:static inset-y-0 left-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-neutral-100 mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/techdome.png"
                alt="Techdome"
                className="h-8 w-auto object-contain"
              />
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider pl-3 border-l border-neutral-200 font-semibold">
                Studio CMS
              </span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono font-semibold uppercase text-neutral-400 px-3 mb-2 tracking-wider">
              Management
            </div>

            {/* TAB 1: Ventures Model */}
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
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === 'ventures' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-700'
              }`}>
                {ventures.length}
              </span>
            </button>

            {/* TAB 2: Inquiries CRM */}
            <button
              onClick={() => {
                setActiveTab('inquiries');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeTab === 'inquiries'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Client Inquiries CRM</span>
              </div>
              {stats.inquiriesNew > 0 ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold animate-pulse">
                  {stats.inquiriesNew} New
                </span>
              ) : (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === 'inquiries' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {inquiries.length}
                </span>
              )}
            </button>

            {/* TAB 3: Services & Engagement Models */}
            <button
              onClick={() => {
                setActiveTab('services');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeTab === 'services'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>Services & Models</span>
              </div>
              <span className="text-[10px] font-mono">4+4</span>
            </button>

            {/* TAB 4: Global Settings */}
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

            {/* TAB 5: REST Endpoints */}
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

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-neutral-100 space-y-2.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 text-xs font-mono transition-colors"
            title="Lock studio"
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
        <header className="h-16 sm:h-20 bg-white border-b border-neutral-200 px-4 sm:px-8 lg:px-10 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-display font-bold text-lg sm:text-2xl text-black truncate">
              {activeTab === 'ventures' && 'Portfolio Ventures'}
              {activeTab === 'inquiries' && 'Client Consultation Leads'}
              {activeTab === 'services' && 'Practice Areas & Engagement Models'}
              {activeTab === 'globals' && 'Studio Global Settings'}
              {activeTab === 'api' && 'REST API Documentation'}
            </h1>
            <p className="text-[11px] sm:text-xs text-neutral-500 font-mono mt-0.5 hidden sm:block">
              {activeTab === 'ventures' && 'Manage all ventures, stages, metrics, and content models'}
              {activeTab === 'inquiries' && 'Incoming discovery meeting requests, venture pitches, and enterprise leads'}
              {activeTab === 'services' && 'Edit studio practice areas, deliverables, and 4 engagement pricing tiers'}
              {activeTab === 'globals' && 'Edit hero headline, subline, metrics, and manifesto statements'}
              {activeTab === 'api' && 'Real-time JSON endpoints served from the local backend'}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleResetSeed}
              className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-black text-xs font-mono font-medium transition-all"
              title="Reset content"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
              <span>Reset Seed</span>
            </button>

            {activeTab === 'ventures' && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Venture</span>
              </button>
            )}

            {activeTab === 'inquiries' && (
              <button
                onClick={loadAllData}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-black text-xs font-mono font-semibold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            )}

            {activeTab === 'globals' && (
              <button
                onClick={handleSaveGlobals}
                disabled={isSavingGlobals}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm disabled:opacity-70"
              >
                {isSavingGlobals ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSavingGlobals ? 'Saving...' : 'Save Settings'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">
          {/* TAB 1: VENTURES */}
          {activeTab === 'ventures' && (
            <div className="space-y-6 max-w-7xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">Total Portfolio</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold font-display text-black">{ventures.length}</span>
                    <span className="text-[11px] text-neutral-500 font-mono">Ventures</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">Launched</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold font-display text-black">{ventures.filter(v => v.stage === 'Launched').length}</span>
                    <span className="text-[11px] text-neutral-600 font-mono">Active</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">Building</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold font-display text-black">{ventures.filter(v => v.stage === 'Building').length}</span>
                    <span className="text-[11px] text-neutral-600 font-mono">Incubation</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">Published Live</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold font-display text-black">{stats.publishedVentures}</span>
                    <span className="text-[11px] text-neutral-600 font-mono">Public</span>
                  </div>
                </div>
              </div>

              {/* Filter & Search */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ventures..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-sans text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                  {['All', 'Launched', 'Building', 'Exited'].map((stg) => (
                    <button
                      key={stg}
                      onClick={() => setSelectedStage(stg)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 whitespace-nowrap ${
                        selectedStage === stg
                          ? 'bg-black text-white font-semibold shadow-xs'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ventures High-Density Table List */}
              {loading ? (
                <div className="py-20 text-center text-neutral-400 font-mono text-xs bg-white rounded-2xl border border-neutral-200">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-black" />
                  Loading portfolio records...
                </div>
              ) : filteredVentures.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs font-mono">
                  No ventures match search criteria.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                  <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-50 border-b border-neutral-200 text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider">
                    <div className="col-span-4">Venture Name & Route</div>
                    <div className="col-span-2">Incubation Stage</div>
                    <div className="col-span-3">One-Liner Overview</div>
                    <div className="col-span-1">Traction</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {filteredVentures.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => handleOpenModal(v)}
                        className="p-4 sm:px-6 sm:py-3.5 hover:bg-neutral-50/80 transition-colors flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 items-start lg:items-center cursor-pointer group"
                      >
                        <div className="lg:col-span-4 flex items-center gap-3 min-w-0 w-full">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-black text-white flex items-center justify-center shrink-0 shadow-2xs">
                            {v.image_url ? (
                              <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                            ) : (
                              <Layers className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-display font-bold text-sm text-black tracking-tight truncate group-hover:text-neutral-700">
                                {v.name}
                              </h3>
                              <span className="lg:hidden text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-black border border-neutral-200">
                                {v.stage}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-neutral-400 truncate block">
                              /{v.slug} {v.tagline && `• ${v.tagline}`}
                            </span>
                          </div>
                        </div>

                        <div className="hidden lg:block lg:col-span-2">
                          <span className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full border inline-block ${
                            v.stage === 'Launched'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : v.stage === 'Building'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}>
                            {v.stage}
                          </span>
                        </div>

                        <div className="lg:col-span-3 min-w-0 w-full">
                          <p className="text-xs text-neutral-600 truncate font-normal leading-normal" title={v.one_liner}>
                            {v.one_liner}
                          </p>
                        </div>

                        <div className="lg:col-span-1 text-xs font-mono font-semibold text-black">
                          {v.metrics || 'Pre-Seed'}
                        </div>

                        <div className="lg:col-span-2 flex items-center justify-end gap-1.5 w-full lg:w-auto self-end lg:self-center">
                          <button
                            onClick={(e) => handleTogglePublish(v, e)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors ${
                              v.published !== false ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500'
                            }`}
                            title={v.published !== false ? 'Click to unpublish' : 'Click to publish'}
                          >
                            {v.published !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{v.published !== false ? 'Live' : 'Draft'}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(v);
                            }}
                            className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-black text-xs transition-colors"
                            title="Edit Venture"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => handleDeleteVenture(v.id, v.name, e)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Delete Venture"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLIENT INQUIRIES CRM */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 max-w-7xl">
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search client leads..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-sans text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                  {['All', 'New', 'Contacted', 'In Review', 'Closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedInquiryStatus(status)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap ${
                        selectedInquiryStatus === status
                          ? 'bg-black text-white font-semibold'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs font-mono">
                  No consultation requests found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-3.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold font-display text-base text-black">{inquiry.name}</h3>
                            <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full ${
                              inquiry.status === 'New'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inquiry.status === 'Contacted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}>
                              {inquiry.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-neutral-400" />
                              {inquiry.email}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-neutral-400" />
                              {inquiry.company}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="text-[10px] font-mono text-neutral-400">Status:</span>
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleUpdateInquiryStatus(inquiry.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-neutral-200 text-xs font-mono text-black bg-white"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Review">In Review</option>
                            <option value="Closed">Closed</option>
                          </select>

                          <button
                            onClick={(e) => handleDeleteInquiry(inquiry.id, e)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono bg-neutral-50 p-3 rounded-xl">
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase">Engagement</span>
                          <span className="font-semibold text-black">{inquiry.project_type}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase">Budget Tier</span>
                          <span className="font-semibold text-black">{inquiry.budget_range}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase">Timeline</span>
                          <span className="font-semibold text-black">{inquiry.timeline}</span>
                        </div>
                      </div>

                      {inquiry.message && (
                        <div className="text-xs text-neutral-700 leading-relaxed bg-white p-3 rounded-xl border border-neutral-100 flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                          <p className="font-sans">{inquiry.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SERVICES & ENGAGEMENT MODELS */}
          {activeTab === 'services' && (
            <div className="space-y-10 max-w-6xl">
              {/* Section 1: Practice Areas */}
              <div className="space-y-5">
                <div className="pb-3 border-b border-neutral-200">
                  <h2 className="text-lg font-bold font-display text-black">4 Practice Areas ("How We Build")</h2>
                  <p className="text-xs font-mono text-neutral-500">Edit titles, taglines, deliverables and descriptions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {services.map((srv) => (
                    <div key={srv.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-neutral-400">
                          Practice {srv.id}
                        </span>
                        <button
                          onClick={() => handleSaveService(srv)}
                          disabled={savingServiceId === srv.id}
                          className="px-3 py-1 rounded-lg bg-black text-white text-xs font-mono font-semibold flex items-center gap-1 shadow-sm"
                        >
                          {savingServiceId === srv.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          <span>Save</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Title</label>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setServices(prev => prev.map(s => s.id === srv.id ? { ...s, title: val } : s));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold text-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Tagline</label>
                        <input
                          type="text"
                          value={srv.tagline}
                          onChange={(e) => {
                            const val = e.target.value;
                            setServices(prev => prev.map(s => s.id === srv.id ? { ...s, tagline: val } : s));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-700"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={srv.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setServices(prev => prev.map(s => s.id === srv.id ? { ...s, description: val } : s));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-700 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Engagement Models */}
              <div className="space-y-5">
                <div className="pb-3 border-b border-neutral-200">
                  <h2 className="text-lg font-bold font-display text-black">4 Engagement Models ("Partnership & Pricing")</h2>
                  <p className="text-xs font-mono text-neutral-500">Edit model descriptions, pricing badges, and CTAs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {engagementModels.map((model) => (
                    <div key={model.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-neutral-400">
                          Tier {model.id} {model.featured && '· ★ Featured'}
                        </span>
                        <button
                          onClick={() => handleSaveEngagementModel(model)}
                          disabled={savingModelId === model.id}
                          className="px-3 py-1 rounded-lg bg-black text-white text-xs font-mono font-semibold flex items-center gap-1 shadow-sm"
                        >
                          {savingModelId === model.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          <span>Save</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Model Name</label>
                          <input
                            type="text"
                            value={model.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEngagementModels(prev => prev.map(m => m.id === model.id ? { ...m, title: val } : m));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold text-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Badge / Pricing</label>
                          <input
                            type="text"
                            value={model.badge}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEngagementModels(prev => prev.map(m => m.id === model.id ? { ...m, badge: val } : m));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-mono text-neutral-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={model.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEngagementModels(prev => prev.map(m => m.id === model.id ? { ...m, description: val } : m));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-700 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GLOBALS SETTINGS */}
          {activeTab === 'globals' && (
            <div className="bg-white p-5 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs max-w-5xl">
              <div className="pb-5 border-b border-neutral-100 mb-6">
                <h2 className="font-display font-bold text-lg sm:text-xl text-black">Studio Copy & Hero Positioning</h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  100% dynamic CMS driven statements and realistic business impact metrics.
                </p>
              </div>

              <form onSubmit={handleSaveGlobals} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">
                        Studio Name
                      </label>
                      <input
                        type="text"
                        value={globalsForm.studio_name || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, studio_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-sans text-black focus:ring-2 focus:ring-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">
                        Hero Eyebrow Category
                      </label>
                      <input
                        type="text"
                        value={globalsForm.hero_eyebrow || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, hero_eyebrow: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-sans text-black focus:ring-2 focus:ring-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">
                      Hero Primary Headline
                    </label>
                    <input
                      type="text"
                      value={globalsForm.hero_headline || ''}
                      onChange={(e) => setGlobalsForm({ ...globalsForm, hero_headline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-sans text-black font-semibold focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">
                      Hero Subline Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={globalsForm.hero_subline || ''}
                      onChange={(e) => setGlobalsForm({ ...globalsForm, hero_subline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-sans text-black leading-relaxed focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4 Metrics */}
                <div className="pt-5 border-t border-neutral-100">
                  <span className="text-xs font-mono font-semibold uppercase text-neutral-400 tracking-wider block mb-3">
                    4 Business-Driven Studio Impact Metrics
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Global Clients</label>
                      <input
                        type="text"
                        value={globalsForm.stats_clients_val || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_clients_val: e.target.value })}
                        className="w-full px-2.5 py-1.5 mb-1.5 rounded-lg border border-neutral-200 text-xs bg-white font-bold font-mono text-black"
                      />
                      <input
                        type="text"
                        value={globalsForm.stats_clients_label || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_clients_label: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs bg-white text-black"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Delivered Systems</label>
                      <input
                        type="text"
                        value={globalsForm.stats_delivered_val || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_delivered_val: e.target.value })}
                        className="w-full px-2.5 py-1.5 mb-1.5 rounded-lg border border-neutral-200 text-xs bg-white font-bold font-mono text-black"
                      />
                      <input
                        type="text"
                        value={globalsForm.stats_delivered_label || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_delivered_label: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs bg-white text-black"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Capital Raised</label>
                      <input
                        type="text"
                        value={globalsForm.stats_capital_val || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_capital_val: e.target.value })}
                        className="w-full px-2.5 py-1.5 mb-1.5 rounded-lg border border-neutral-200 text-xs bg-white font-bold font-mono text-black"
                      />
                      <input
                        type="text"
                        value={globalsForm.stats_capital_label || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_capital_label: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs bg-white text-black"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Foundry Speed</label>
                      <input
                        type="text"
                        value={globalsForm.stats_speed_val || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_speed_val: e.target.value })}
                        className="w-full px-2.5 py-1.5 mb-1.5 rounded-lg border border-neutral-200 text-xs bg-white font-bold font-mono text-black"
                      />
                      <input
                        type="text"
                        value={globalsForm.stats_speed_label || ''}
                        onChange={(e) => setGlobalsForm({ ...globalsForm, stats_speed_label: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs bg-white text-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingGlobals}
                    className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-mono font-semibold hover:bg-neutral-800 transition-all shadow-sm"
                  >
                    {isSavingGlobals ? 'Saving Changes...' : 'Save Global Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: API ENDPOINTS */}
          {activeTab === 'api' && (
            <div className="bg-white p-5 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs max-w-5xl space-y-4">
              <div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-black">REST API Live Endpoints</h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Active local API endpoints backing the Techdome Studio slice.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { method: 'GET', path: '/api/ventures', desc: 'Returns all published ventures' },
                  { method: 'GET', path: '/api/ventures/:slug', desc: 'Returns single venture by slug or ID' },
                  { method: 'POST', path: '/api/inquiries', desc: 'Public lead capture endpoint' },
                  { method: 'GET', path: '/api/inquiries', desc: 'Retrieves all client leads' },
                  { method: 'GET', path: '/api/services', desc: 'Returns studio capabilities' },
                  { method: 'GET', path: '/api/engagement-models', desc: 'Returns 4 engagement models' },
                  { method: 'GET', path: '/api/globals', desc: 'Returns studio hero copy and metrics' },
                  { method: 'GET', path: '/api/health', desc: 'Uptime and database health' },
                ].map((ep) => (
                  <div
                    key={ep.path}
                    className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white">
                        {ep.method}
                      </span>
                      <code className="font-mono text-xs font-semibold text-black truncate">
                        {ep.path}
                      </code>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleCopyEndpoint(`${window.location.origin}${ep.path}`)}
                        className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-600 cursor-pointer"
                        title="Copy endpoint"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={ep.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-black font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors"
                      >
                        <span>JSON</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* GRAND POPUP MODAL FOR ADDING / EDITING VENTURE */}
      {isModalOpen && editingVenture && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                    CMS Content Modeling
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-black truncate max-w-xs sm:max-w-md">
                    {editingVenture.id ? `Edit: ${editingVenture.name}` : 'Create Portfolio Venture'}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form id="venture-modal-form" onSubmit={handleSaveVenture} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-[#FAFAFA]">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black tracking-wider pb-2 border-b border-neutral-100">
                  <FileText className="w-3.5 h-3.5" />
                  <span>01 / Core Identity & Routing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">Venture Name *</label>
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold text-black focus:ring-2 focus:ring-black focus:outline-none bg-neutral-50/60 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={editingVenture.slug || ''}
                      onChange={(e) => {
                        setAutoSlug(false);
                        setEditingVenture({ ...editingVenture, slug: e.target.value });
                      }}
                      placeholder="kiteflow-ai"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black bg-neutral-50/60 focus:bg-white focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">Stage Enum *</label>
                    <select
                      value={editingVenture.stage || 'Building'}
                      onChange={(e) => setEditingVenture({ ...editingVenture, stage: e.target.value as VentureStage })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black bg-white focus:ring-2 focus:ring-black focus:outline-none"
                    >
                      <option value="Building">Building (Incubation)</option>
                      <option value="Launched">Launched (Active Scale)</option>
                      <option value="Exited">Exited (Acquired / IPO)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">Category Tagline</label>
                    <input
                      type="text"
                      value={editingVenture.tagline || ''}
                      onChange={(e) => setEditingVenture({ ...editingVenture, tagline: e.target.value })}
                      placeholder="e.g. Cloud Security Engine"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-black focus:ring-2 focus:ring-black focus:outline-none bg-neutral-50/60 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black tracking-wider pb-2 border-b border-neutral-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>02 / Value Proposition & Metrics</span>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">One-Liner Value Prop *</label>
                  <input
                    type="text"
                    required
                    value={editingVenture.one_liner || ''}
                    onChange={(e) => setEditingVenture({ ...editingVenture, one_liner: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-black focus:ring-2 focus:ring-black focus:outline-none bg-neutral-50/60 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">Traction / Capital</label>
                    <input
                      type="text"
                      value={editingVenture.metrics || ''}
                      onChange={(e) => setEditingVenture({ ...editingVenture, metrics: e.target.value })}
                      placeholder="$3.2M Seed"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">Year</label>
                    <input
                      type="text"
                      value={editingVenture.year || ''}
                      onChange={(e) => setEditingVenture({ ...editingVenture, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">Founders</label>
                    <input
                      type="text"
                      value={editingVenture.founders || ''}
                      onChange={(e) => setEditingVenture({ ...editingVenture, founders: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">Image URL</label>
                  <input
                    type="url"
                    value={editingVenture.image_url || ''}
                    onChange={(e) => setEditingVenture({ ...editingVenture, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black bg-neutral-50/60 focus:bg-white"
                  />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black tracking-wider pb-2 border-b border-neutral-100">
                  <FileText className="w-3.5 h-3.5" />
                  <span>03 / Thesis & Publishing</span>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">Full Thesis *</label>
                  <textarea
                    rows={4}
                    required
                    value={editingVenture.description || ''}
                    onChange={(e) => setEditingVenture({ ...editingVenture, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-neutral-200 text-xs font-sans text-black leading-relaxed focus:ring-2 focus:ring-black focus:outline-none bg-neutral-50/60 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <label className="flex items-center gap-2.5 text-xs font-bold text-black cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingVenture.published !== false}
                      onChange={(e) => setEditingVenture({ ...editingVenture, published: e.target.checked })}
                      className="w-4 h-4 rounded accent-black"
                    />
                    <span>Publish on Live Website</span>
                  </label>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-black text-white">
                    {editingVenture.published !== false ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
            </form>

            <div className="p-4 sm:p-6 border-t border-neutral-100 bg-white flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                {isSaving ? 'Saving...' : 'Instant SQLite persistence'}
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="venture-modal-form"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
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
