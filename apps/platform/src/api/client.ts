class ApiClient {
  private baseUrl: string = import.meta.env.VITE_BACKEND_URL + '/api/v1';

  constructor(service?: string) {
    this.baseUrl = this.baseUrl + service;
  }

  private async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(this.baseUrl + url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async get<T>(url: string) {
    return this.fetch<T>(url);
  }

  async post<T>(url: string, body: object) {
    return this.fetch<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(url: string, body: object) {
    return this.fetch<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(url: string) {
    return this.fetch<T>(url, {
      method: 'DELETE',
    });
  }
}

export default ApiClient;
