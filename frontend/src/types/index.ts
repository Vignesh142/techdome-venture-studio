export type VentureStage = 'Building' | 'Launched' | 'Exited';
export type StageFilter = 'All' | 'Building' | 'Launched' | 'Exited';

export interface Venture {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  one_liner: string;
  stage: VentureStage;
  year: string;
  metrics: string;
  founders: string;
  website_url: string;
  image_url?: string;
  image_symbol?: 'shield' | 'network' | 'activity' | 'cpu' | 'database' | string;
  accent_pattern?: 'mesh' | 'dots' | 'rings' | 'matrix' | string;
  tech_stack?: string[];
  description: string;
  published?: boolean;
  updatedAt?: string;
}

export interface StudioService {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: 'rocket' | 'cpu' | 'users' | 'zap' | string;
  highlight?: string;
}

export interface EngagementModel {
  id: number;
  title: string;
  badge: string;
  timeline?: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export interface ClientInquiry {
  id: number;
  name: string;
  email: string;
  company: string;
  project_type: 'Venture Co-Founding' | 'Enterprise AI & Cloud' | 'Dedicated Engineering Pod' | 'Rapid 14-Day MVP' | string;
  budget_range: '< $25k' | '$25k - $50k' | '$50k - $150k' | '$150k+' | string;
  timeline: 'Immediate (Within 30 Days)' | '1 - 3 Months' | 'Flexible' | string;
  message: string;
  status: 'New' | 'Contacted' | 'In Review' | 'Closed' | string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GlobalSettings {
  studio_name: string;
  hero_eyebrow: string;
  hero_headline: string;
  hero_subline: string;
  stats_clients_val?: string;
  stats_clients_label?: string;
  stats_delivered_val?: string;
  stats_delivered_label?: string;
  stats_capital_val?: string;
  stats_capital_label?: string;
  stats_speed_val?: string;
  stats_speed_label?: string;
  manifesto_headline: string;
  manifesto_quote: string;
  contact_email: string;
  location: string;
  studio_website?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface ApiHealthResponse {
  status: 'ok' | 'degraded' | 'down';
  service: string;
  version: string;
  uptime: number;
  timestamp: string;
  records?: {
    venturesCount: number;
    publishedCount: number;
    inquiriesCount?: number;
    newInquiriesCount?: number;
  };
}
