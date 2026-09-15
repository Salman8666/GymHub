/**
 * Gym Hub Unified API Client
 * Connects frontend React state directly to the production Backend services (/api/*)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('gymhub-auth-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || 'API request failed');
    }
    return json.data as T;
  } catch (error: any) {
    console.warn(`[API Client Warning] ${endpoint}:`, error.message);
    throw error;
  }
}

export const apiClient = {
  auth: {
    login: (email: string, password?: string) =>
      request<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password?: string, role: string = 'USER') =>
      request<{ user: any; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      }),
    me: () => request<any>('/auth/me'),
  },

  trainers: {
    getAll: (params?: { search?: string; maxPrice?: number; experience?: number }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<any[]>(`/trainers?${q}`);
    },
    getById: (id: string) => request<any>(`/trainers/${id}`),
    createReview: (id: string, data: { rating: number; comment: string }) =>
      request<any>(`/trainers/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => request<any>('/trainers/me'),
    updateProfile: (data: any) =>
      request<any>('/trainers/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  gyms: {
    getAll: (params?: { search?: string; acType?: string; maxDayPass?: number }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<any[]>(`/gyms?${q}`);
    },
    getById: (id: string) => request<any>(`/gyms/${id}`),
    create: (data: any) =>
      request<any>('/gyms', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    createReview: (id: string, data: { rating: number; comment: string }) =>
      request<any>(`/gyms/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  plans: {
    getAll: (params?: { search?: string; category?: string; difficulty?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<any[]>(`/plans?${q}`);
    },
    create: (data: any) =>
      request<any>('/plans', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  products: {
    getAll: (params?: { search?: string; category?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<any[]>(`/products?${q}`);
    },
    getById: (id: string) => request<any>(`/products/${id}`),
    create: (data: any) =>
      request<any>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    createReview: (id: string, data: { rating: number; comment: string }) =>
      request<any>(`/products/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  cart: {
    get: () => request<any>('/cart'),
    add: (productId: string, variantId?: string, quantity: number = 1) =>
      request<any>('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, variantId, quantity }),
      }),
    updateQuantity: (itemId: string, quantity: number) =>
      request<any>('/cart', {
        method: 'PATCH',
        body: JSON.stringify({ itemId, quantity }),
      }),
    remove: (itemId: string) =>
      request<any>(`/cart?itemId=${itemId}`, { method: 'DELETE' }),
  },

  checkout: {
    createSession: (discountCode?: string, shippingAddress?: any) =>
      request<any>('/checkout', {
        method: 'POST',
        body: JSON.stringify({ discountCode, shippingAddress }),
      }),
  },

  bookings: {
    getAvailability: (trainerProfileId: string, date: string) =>
      request<any[]>(`/bookings?trainerProfileId=${trainerProfileId}&date=${date}`),
    create: (data: { trainerProfileId: string; gymId?: string; date: string; startTime: string; endTime: string; notes?: string }) =>
      request<any>('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getUserBookings: () => request<any[]>('/bookings'),
  },

  orders: {
    getAll: () => request<any[]>('/orders'),
  },

  analytics: {
    getMetrics: () => request<{
      activeClients: number;
      monthlyPayout: number;
      totalOrders: number;
      workoutsLogged: number;
      planSales: number;
      revenueTrend: string;
      satisfactionRate: string;
    }>('/analytics'),
  },
};
