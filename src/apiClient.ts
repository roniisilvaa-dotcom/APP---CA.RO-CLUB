/**
 * CLUBOS API Client
 * Integra com o backend Express/Neon quando disponível.
 * Fallback para localStorage quando offline ou sem backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

let authToken: string | null = localStorage.getItem('CLUBOS_JWT_TOKEN');

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  return headers;
}

async function apiFetch(path: string, options?: RequestInit) {
  if (!API_BASE) throw new Error('No API configured');

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options?.headers || {}) }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    authToken = data.token;
    localStorage.setItem('CLUBOS_JWT_TOKEN', data.token);
    return data;
  },

  async register(name: string, city: string, categoryFocus: string, adminEmail: string, password: string) {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, city, categoryFocus, adminEmail, password })
    });
    authToken = data.token;
    localStorage.setItem('CLUBOS_JWT_TOKEN', data.token);
    return data;
  },

  logout() {
    authToken = null;
    localStorage.removeItem('CLUBOS_JWT_TOKEN');
  },

  // Players
  async getPlayers(clubId?: string) {
    const qs = clubId ? `?clubId=${clubId}` : '';
    return apiFetch(`/api/players${qs}`);
  },

  async createPlayer(clubId: string, player: Record<string, unknown>) {
    return apiFetch('/api/players', {
      method: 'POST',
      body: JSON.stringify({ clubId, player })
    });
  },

  async toggleSubscription(playerId: string, feeId: string) {
    return apiFetch(`/api/players/${playerId}/subscription-toggle`, {
      method: 'POST',
      body: JSON.stringify({ feeId })
    });
  },

  async addHistoryEvent(playerId: string, data: Record<string, unknown>) {
    return apiFetch(`/api/players/${playerId}/history`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Financials
  async getFinancials(clubId?: string) {
    const qs = clubId ? `?clubId=${clubId}` : '';
    return apiFetch(`/api/financials${qs}`);
  },

  async addTransaction(clubId: string, entry: Record<string, unknown>) {
    return apiFetch('/api/financials', {
      method: 'POST',
      body: JSON.stringify({ clubId, entry })
    });
  },

  // Clubs (master)
  async getClubs() {
    return apiFetch('/api/clubs');
  }
};

export const isApiConfigured = () => !!API_BASE;
