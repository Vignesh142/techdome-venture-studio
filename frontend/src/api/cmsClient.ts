import { Venture, GlobalSettings, StudioService, ClientInquiry, ApiResponse, ApiHealthResponse } from '../types';

const CMS_BASE_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:1337';

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

async function fetchFromCms<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${CMS_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Response wasn't JSON
      }
      throw new CmsApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CmsApiError) {
      throw error;
    }
    const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
    const msg = isNetworkError
      ? `Cannot connect to Techdome Headless CMS at ${CMS_BASE_URL}. Ensure local CMS backend is running.`
      : (error instanceof Error ? error.message : 'Unknown CMS error occurred');
    throw new CmsApiError(msg);
  }
}

export const cmsClient = {
  // Health
  async checkHealth(): Promise<ApiHealthResponse> {
    return fetchFromCms<ApiHealthResponse>('/api/health');
  },

  // Globals
  async getGlobals(): Promise<GlobalSettings> {
    const res = await fetchFromCms<ApiResponse<GlobalSettings>>('/api/globals');
    return res.data;
  },

  async updateGlobals(data: Partial<GlobalSettings>): Promise<GlobalSettings> {
    const res = await fetchFromCms<ApiResponse<GlobalSettings>>('/api/globals', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Services
  async getServices(): Promise<StudioService[]> {
    const res = await fetchFromCms<ApiResponse<StudioService[]>>('/api/services');
    return res.data;
  },

  // Ventures
  async getVentures(stage?: string, includeDrafts: boolean = false): Promise<Venture[]> {
    const params = new URLSearchParams();
    if (stage && stage !== 'All') params.append('stage', stage);
    if (includeDrafts) params.append('drafts', 'true');
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetchFromCms<ApiResponse<Venture[]>>(`/api/ventures${query}`);
    return res.data;
  },

  async getVentureBySlug(slug: string, includeDrafts: boolean = false): Promise<Venture> {
    const query = includeDrafts ? '?drafts=true' : '';
    const res = await fetchFromCms<ApiResponse<Venture>>(`/api/ventures/${slug}${query}`);
    return res.data;
  },

  async createVenture(data: Partial<Venture>): Promise<Venture> {
    const res = await fetchFromCms<ApiResponse<Venture>>('/api/ventures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateVenture(id: number, data: Partial<Venture>): Promise<Venture> {
    const res = await fetchFromCms<ApiResponse<Venture>>(`/api/ventures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteVenture(id: number): Promise<boolean> {
    await fetchFromCms<ApiResponse<{ message: string }>>(`/api/ventures/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  // Inquiries / Leads (CRM)
  async submitInquiry(data: Partial<ClientInquiry>): Promise<ClientInquiry> {
    const res = await fetchFromCms<ApiResponse<ClientInquiry>>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async getInquiries(status?: string): Promise<ClientInquiry[]> {
    const query = status && status !== 'All' ? `?status=${status}` : '';
    const res = await fetchFromCms<ApiResponse<ClientInquiry[]>>(`/api/inquiries${query}`);
    return res.data;
  },

  async updateInquiry(id: number, data: { status?: string; notes?: string }): Promise<ClientInquiry> {
    const res = await fetchFromCms<ApiResponse<ClientInquiry>>(`/api/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteInquiry(id: number): Promise<boolean> {
    await fetchFromCms<ApiResponse<{ message: string }>>(`/api/inquiries/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  // Reset
  async resetSeed(): Promise<unknown> {
    const res = await fetchFromCms<ApiResponse<unknown>>('/api/reset', {
      method: 'POST',
    });
    return res.data;
  }
};
