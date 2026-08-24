import { Venture, GlobalSettings, ApiResponse, ApiHealthResponse, VentureStage } from '../types';

const API_BASE = import.meta.env.VITE_CMS_API_URL || 'http://localhost:1337/api';

export class CmsApiError extends Error {
  public statusCode?: number;
  public endpoint: string;

  constructor(message: string, endpoint: string, statusCode?: number) {
    super(message);
    this.name = 'CmsApiError';
    this.endpoint = endpoint;
    this.statusCode = statusCode;
  }
}

async function fetchFromCms<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status} (${response.statusText})`;
      try {
        const errorJson = await response.json();
        if (errorJson.error) errorMessage = errorJson.error;
      } catch {
        // fallback
      }
      throw new CmsApiError(errorMessage, endpoint, response.status);
    }

    const data: ApiResponse<T> = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof CmsApiError) {
      throw error;
    }
    throw new CmsApiError(
      `Cannot connect to CMS engine at ${API_BASE}. Ensure the CMS server is running on localhost:1337.`,
      endpoint
    );
  }
}

export const cmsClient = {
  checkHealth: async (): Promise<ApiHealthResponse> => {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) throw new Error('CMS health check failed');
    return response.json();
  },

  getGlobals: async (): Promise<GlobalSettings> => {
    return fetchFromCms<GlobalSettings>('/globals');
  },

  updateGlobals: async (globalsData: Partial<GlobalSettings>): Promise<GlobalSettings> => {
    return fetchFromCms<GlobalSettings>('/globals', {
      method: 'PUT',
      body: JSON.stringify(globalsData),
    });
  },

  getVentures: async (stage?: VentureStage | 'All', includeDrafts: boolean = false): Promise<Venture[]> => {
    const params = new URLSearchParams();
    if (stage && stage !== 'All') params.append('stage', stage);
    if (includeDrafts) params.append('drafts', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchFromCms<Venture[]>(`/ventures${query}`);
  },

  getVentureBySlug: async (slug: string): Promise<Venture> => {
    return fetchFromCms<Venture>(`/ventures/${slug}`);
  },

  createVenture: async (ventureData: Partial<Venture>): Promise<Venture> => {
    return fetchFromCms<Venture>('/ventures', {
      method: 'POST',
      body: JSON.stringify(ventureData),
    });
  },

  updateVenture: async (id: number, ventureData: Partial<Venture>): Promise<Venture> => {
    return fetchFromCms<Venture>(`/ventures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ventureData),
    });
  },

  deleteVenture: async (id: number): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/ventures/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return json.success === true;
  },

  resetSeed: async (): Promise<unknown> => {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
    });
    return res.json();
  },

  adminUrl: 'http://localhost:1337/admin',
};
