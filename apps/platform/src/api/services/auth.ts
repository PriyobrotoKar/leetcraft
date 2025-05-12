import ApiClient from '../client';

class AuthService {
  private static apiClient: ApiClient = new ApiClient('/auth');

  static async login(data: { email: string; password: string }) {
    return this.apiClient.post('/login', data);
  }
}

export default AuthService;
