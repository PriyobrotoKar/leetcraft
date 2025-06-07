import { User } from '@leetcraft/db';
import ApiClient from '../client';

class AuthService {
  private static apiClient: ApiClient = new ApiClient('/auth');

  static async login(data: { email: string; password: string }) {
    return this.apiClient.post<{ token: string; user: User }>('/login', data);
  }

  static async register(data: {
    email: string;
    password: string;
    name: string;
  }) {
    return this.apiClient.post<User>('/register', data);
  }

  static async getMe() {
    return this.apiClient.get<User>('/me');
  }

  static async logout() {
    return this.apiClient.post('/logout');
  }
}

export default AuthService;
