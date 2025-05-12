class ApiClient {
  private baseUrl: string = import.meta.env.VITE_BACKEND_URL + '/api/v1';

  constructor(service?: string) {
    this.baseUrl = this.baseUrl + service;
  }

  private async fetch(url: string, options?: RequestInit) {
    try {
      const response = await fetch(this.baseUrl + url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async get(url: string) {
    return this.fetch(url);
  }

  async post(url: string, body: object) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(url: string, body: object) {
    return this.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete(url: string) {
    return this.fetch(url, {
      method: 'DELETE',
    });
  }
}

export default ApiClient;
