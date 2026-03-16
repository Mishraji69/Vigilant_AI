/**
 * Centralized API Client for Vigilant AI Backend
 * Handles all HTTP requests with error handling and timeout safety
 */

// Smart API URL detection:
// 1. Use VITE_API_BASE_URL env var if set (explicit override)
// 2. In production (non-localhost), use same origin (backend serves from same domain)
// 3. In development, fall back to localhost:5000
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    return window.location.origin; // Same domain in production
  }
  return 'http://localhost:5000';
};
const BASE_URL = getBaseUrl();
const DEFAULT_TIMEOUT = 30000; // 30 seconds

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Create a fetch request with timeout
 */
const fetchWithTimeout = async (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, null);
    }
    throw error;
  }
};

/**
 * Parse response and handle errors
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
};

/**
 * Main API client object
 */
const apiClient = {
  /**
   * GET request
   */
  async get(endpoint, params = {}, options = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetchWithTimeout(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }, options.timeout);

    return handleResponse(response);
  },

  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    }, options.timeout);

    return handleResponse(response);
  },

  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetchWithTimeout(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    }, options.timeout);

    return handleResponse(response);
  },

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }, options.timeout);

    return handleResponse(response);
  },

  /**
   * Download file (returns blob)
   */
  async download(endpoint, params = {}, options = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetchWithTimeout(url.toString(), {
      method: 'GET',
      headers: options.headers || {},
    }, options.timeout);

    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(`Download failed: ${text}`, response.status, null);
    }

    return response.blob();
  },

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await this.get('/api/health', {}, { timeout: 5000 });
      return { healthy: true, ...response };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  },

  /**
   * Get base URL
   */
  getBaseUrl() {
    return BASE_URL;
  }
};

export default apiClient;
export { ApiError };
