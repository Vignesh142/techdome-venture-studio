export type VentureStage = 'Building' | 'Launched' | 'Exited';

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
  image_symbol?: string;
  accent_pattern?: string;
  description: string;
  published?: boolean;
  updatedAt?: string;
}

export interface GlobalSettings {
  studio_name: string;
  hero_eyebrow: string;
  hero_headline: string;
  hero_subline: string;
  stats_metric_1_val: string;
  stats_metric_1_label: string;
  stats_metric_2_val: string;
  stats_metric_2_label: string;
  stats_metric_3_val: string;
  stats_metric_3_label: string;
  manifesto_headline: string;
  manifesto_quote: string;
  contact_email: string;
  location: string;
  studio_website: string;
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
  status: string;
  service: string;
  version: string;
  uptime: number;
  timestamp: string;
  records: {
    venturesCount: number;
    publishedCount: number;
  };
}

export type StageFilter = 'All' | VentureStage;
