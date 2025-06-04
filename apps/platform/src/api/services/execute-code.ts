import { SupportedLanguage } from '@leetcraft/boilerplate-generator';
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

export interface ExecuteCodePayload {
  problemId: string;
  code: string;
  language: SupportedLanguage;
  testcases: { input: string; output: string }[];
}

class ExecuteCodeService {
  private static apiClient: ApiClient = new ApiClient('/execute');

  static async executeCode(data: ExecuteCodePayload) {
    return this.apiClient.post<{ tokens: string[] }>('/', data);
  }

  static async validate(data: { tokens: string[] }) {
    return this.apiClient.post<{
      pending: boolean;
      results: ExecuteCodeResponse[];
    }>('/validate', data);
  }
}

export default ExecuteCodeService;
