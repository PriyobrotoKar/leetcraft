import { Problem } from '@leetcraft/db';
import ApiClient from '../client';

class ProblemService {
  private static apiClient: ApiClient = new ApiClient('/problems');

  static async getProblems() {
    return this.apiClient.get<Problem[]>('/');
  }
}
export default ProblemService;
