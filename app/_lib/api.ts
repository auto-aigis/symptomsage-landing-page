const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const detail = err.detail;
      if (typeof detail === 'string') msg = detail;
      else if (Array.isArray(detail)) msg = detail.map((e: any) => e.msg).join(', ');
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, display_name?: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ id: string; email: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ status: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  me: () =>
    apiFetch<{
      id: string;
      email: string;
      display_name: string;
      conditions: string[];
      reminder_time: string | null;
      onboarding_completed: boolean;
      created_at: string;
    }>('/api/auth/me'),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const logsApi = {
  create: (data: {
    entry_text?: string;
    sleep_quality?: number;
    energy_level?: number;
    stress_level?: number;
    pain_level?: number;
  }) =>
    apiFetch<{
      id: string;
      user_id: string;
      entry_text: string;
      sleep_quality: number | null;
      energy_level: number | null;
      stress_level: number | null;
      pain_level: number | null;
      logged_at: string;
      created_at: string;
    }>('/api/logs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  list: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    const query = params.toString();
    return apiFetch<any[]>(`/api/logs${query ? `?${query}` : ''}`);
  },

  get: (id: string) =>
    apiFetch<{
      id: string;
      user_id: string;
      entry_text: string;
      sleep_quality: number | null;
      energy_level: number | null;
      stress_level: number | null;
      pain_level: number | null;
      logged_at: string;
      created_at: string;
    }>(`/api/logs/${id}`),
};

export const insightsApi = {
  get: () =>
    apiFetch<{
      patterns: Array<{
        pattern_text: string;
        observation_count: number;
        confidence: 'Low' | 'Medium' | 'High';
      }>;
      weekly_summary: string;
      generated_at: string;
      log_count_at_generation: number;
    }>('/api/insights'),

  refresh: () =>
    apiFetch<{ status: string; log_count: number }>('/api/insights/refresh', {
      method: 'POST',
    }),
};

export const reportsApi = {
  generate: (dateFrom: string, dateTo: string) =>
    apiFetch<{
      id: string;
      user_id: string;
      date_from: string;
      date_to: string;
      content_text: string;
      share_token: string | null;
      created_at: string;
    }>('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ date_from: dateFrom, date_to: dateTo }),
    }),

  get: (id: string) =>
    apiFetch<{
      id: string;
      user_id: string;
      date_from: string;
      date_to: string;
      content_text: string;
      share_token: string | null;
      created_at: string;
    }>(`/api/reports/${id}`),

  getShareUrl: (id: string) =>
    apiFetch<{ share_url: string }>(`/api/reports/${id}/share`),
};

export const subscriptionApi = {
  get: () =>
    apiFetch<{
      tier: 'free' | 'pro' | 'plus';
      status: 'inactive' | 'active' | 'canceled' | 'trialing';
      trial_ends_at: string | null;
      current_period_end: string | null;
    }>('/api/paddle/subscription'),

  checkout: (tier: 'pro' | 'plus', billingInterval: 'monthly' | 'yearly') =>
    apiFetch<{ price_id: string; client_token: string }>('/api/paddle/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),

  verifyTransaction: (transactionId: string) =>
    apiFetch<{ status: string; tier: string }>('/api/paddle/verify-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    }),
};

export const settingsApi = {
  get: () =>
    apiFetch<{
      display_name: string;
      email: string;
      conditions: string[];
      reminder_time: string | null;
      subscription: {
        tier: 'free' | 'pro' | 'plus';
        status: 'inactive' | 'active' | 'canceled' | 'trialing';
        trial_ends_at: string | null;
        current_period_end: string | null;
      };
    }>('/api/settings'),

  update: (data: {
    display_name?: string;
    conditions?: string[];
    reminder_time?: string;
  }) =>
    apiFetch<{
      display_name: string;
      email: string;
      conditions: string[];
      reminder_time: string | null;
      subscription: {
        tier: 'free' | 'pro' | 'plus';
        status: 'inactive' | 'active' | 'canceled' | 'trialing';
        trial_ends_at: string | null;
        current_period_end: string | null;
      };
    }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
