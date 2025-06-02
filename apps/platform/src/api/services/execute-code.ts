import ApiClient from '../client';

export interface ExecuteCodeResponse {
  token: string;
  message: string;
  status: number;
  input: string;
  output: string;
  error: string;
  expectedOutput: string;
}

class ExecuteCodeService {
  private static apiClient: ApiClient = new ApiClient('/execute');

  static async validate(data: { tokens: string[] }) {
    return this.apiClient.post<{
      pending: boolean;
      results: ExecuteCodeResponse[];
    }>('/validate', data);
  }
}

export default ExecuteCodeService;
