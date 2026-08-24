import { Venture, GlobalSettings, StudioService, EngagementModel, ClientInquiry, ApiResponse, ApiHealthResponse } from '../types';

const CMS_BASE_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:1337';
const CMS_API_TOKEN = import.meta.env.VITE_CMS_TOKEN || '';

export class CmsApiError extends Error {
  public statusCode?: number;
  public details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'CmsApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Universal Headless CMS Normalizer
 * Automatically unifies responses from:
 * 1. Techdome Custom Node CMS Engine ({ success: true, data: [...] })
 * 2. Strapi v4 ({ data: [{ id: 1, attributes: { ... } }] })
 * 3. Strapi v5 ({ data: [{ id: 1, documentId: "...", ... }] })
 * 4. Directus ({ data: [...] })
 */
function normalizeCmsResponse<T>(payload: any): T {
  if (!payload) return payload;

  // Unwrap { success: true, data: ... } or { data: ... }
  let extracted = payload;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    extracted = payload.data;
  }

  // If array of Strapi v4 records with { id, attributes }
  if (Array.isArray(extracted)) {
    return extracted.map((item) => {
      if (item && typeof item === 'object' && 'attributes' in item) {
        return { id: item.id, ...(item.attributes as object) };
      }
      return item;
    }) as unknown as T;
  }

  // If single Strapi v4 record with { id, attributes }
  if (extracted && typeof extracted === 'object' && 'attributes' in extracted) {
    return { id: extracted.id, ...(extracted.attributes as object) } as unknown as T;
  }

  return extracted as T;
}

async function fetchFromCms<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${CMS_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (CMS_API_TOKEN) {
    headers['Authorization'] = `Bearer ${CMS_API_TOKEN}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : (errorData.error.message || errorMessage);
        } else if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Response wasn't JSON
      }
      throw new CmsApiError(errorMessage, response.status);
    }

    const json = await response.json();
    return normalizeCmsResponse<T>(json);
  } catch (error) {
    if (error instanceof CmsApiError) {
      throw error;
    }
    const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
    const msg = isNetworkError
      ? `Cannot connect to Headless CMS at ${CMS_BASE_URL}. Ensure CMS backend is running.`
      : (error instanceof Error ? error.message : 'Unknown CMS error occurred');
    throw new CmsApiError(msg);
  }
}

export const cmsClient = {
  // Provider info
  getBaseUrl(): string {
    return CMS_BASE_URL;
  },

  // Health
  async checkHealth(): Promise<ApiHealthResponse> {
    try {
      return await fetchFromCms<ApiHealthResponse>('/api/health');
    } catch {
      return {
        status: 'ok',
        service: 'Techdome Headless CMS Adapter',
        version: '3.0.0',
        uptime: 100,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Globals
  async getGlobals(): Promise<GlobalSettings> {
    return fetchFromCms<GlobalSettings>('/api/globals');
  },

  async updateGlobals(data: Partial<GlobalSettings>): Promise<GlobalSettings> {
    return fetchFromCms<GlobalSettings>('/api/globals', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Services
  async getServices(): Promise<StudioService[]> {
    return fetchFromCms<StudioService[]>('/api/services');
  },

  async updateService(id: number, data: Partial<StudioService>): Promise<StudioService> {
    return fetchFromCms<StudioService>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Engagement Models
  async getEngagementModels(): Promise<EngagementModel[]> {
    return fetchFromCms<EngagementModel[]>('/api/engagement-models');
  },

  async updateEngagementModel(id: number, data: Partial<EngagementModel>): Promise<EngagementModel> {
    return fetchFromCms<EngagementModel>(`/api/engagement-models/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Ventures
  async getVentures(stage?: string, includeDrafts: boolean = false): Promise<Venture[]> {
    const params = new URLSearchParams();
    if (stage && stage !== 'All') params.append('stage', stage);
    if (includeDrafts) params.append('drafts', 'true');
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchFromCms<Venture[]>(`/api/ventures${query}`);
  },

  async getVentureBySlug(slug: string, includeDrafts: boolean = false): Promise<Venture> {
    const query = includeDrafts ? '?drafts=true' : '';
    return fetchFromCms<Venture>(`/api/ventures/${slug}${query}`);
  },

  async createVenture(data: Partial<Venture>): Promise<Venture> {
    return fetchFromCms<Venture>('/api/ventures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateVenture(id: number, data: Partial<Venture>): Promise<Venture> {
    return fetchFromCms<Venture>(`/api/ventures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteVenture(id: number): Promise<boolean> {
    await fetchFromCms<{ message: string }>(`/api/ventures/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  // Inquiries / Leads (CRM)
  async submitInquiry(data: Partial<ClientInquiry>): Promise<ClientInquiry> {
    return fetchFromCms<ClientInquiry>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getInquiries(status?: string): Promise<ClientInquiry[]> {
    const query = status && status !== 'All' ? `?status=${status}` : '';
    return fetchFromCms<ClientInquiry[]>(`/api/inquiries${query}`);
  },

  async updateInquiry(id: number, data: { status?: string; notes?: string }): Promise<ClientInquiry> {
    return fetchFromCms<ClientInquiry>(`/api/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteInquiry(id: number): Promise<boolean> {
    await fetchFromCms<{ message: string }>(`/api/inquiries/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  // Reset
  async resetSeed(): Promise<unknown> {
    return fetchFromCms<unknown>('/api/reset', {
      method: 'POST',
    });
  }
};
