const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiService = {
  // عمومی
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // اخبار
  news: {
    getConfig() {
      return this.request('/api/news/config');
    },
    
    getFilters() {
      return this.request('/api/news/filters');
    },
    
    getArticles(filters = {}) {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.impact && filters.impact !== 'all') params.append('impact', filters.impact);
      if (filters.sentiment && filters.sentiment !== 'all') params.append('sentiment', filters.sentiment);
      params.append('limit', '50');
      
      return this.request(`/api/news?${params}`);
    }
  },

  // تقویم
  calendar: {
    getConfig() {
      return this.request('/api/calendar/config');
    },
    
    getEvents() {
      return this.request('/api/calendar/events');
    }
  },

  // سیگنال‌ها
  signals: {
    getSignals() {
      return this.request('/api/signals');
    }
  },

  // داشبورد
  dashboard: {
    getStats() {
      return this.request('/api/dashboard/stats');
    }
  },

  // همه صفحات
  pages: {
    getConfig(pageName) {
      return this.request(`/api/pages/${pageName}/config`);
    }
  }
};

export default apiService;