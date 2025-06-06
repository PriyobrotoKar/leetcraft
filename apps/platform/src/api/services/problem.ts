import { Boilerplate, Prisma, Problem } from '@leetcraft/db';
import ApiClient from '../client';
import { SupportedLanguage } from '@leetcraft/boilerplate-generator';

type ProblemWithBoilerplate = Prisma.ProblemGetPayload<{
  include: {
    boilerplates: true;
  };
}>;

class ProblemService {
  private static apiClient: ApiClient = new ApiClient('/problems');

  static async getProblems() {
    return this.apiClient.get<Problem[]>('/');
  }

  static async getProblemsCreated() {
    return this.apiClient.get<Problem[]>('/created');
  }

  static async getProblemsSolvedByUser() {
    return this.apiClient.get<{
      problems: Problem[];
      stats: {
        problems: {
          solved: number;
          total: number;
        };
        easy: {
          solved: number;
          total: number;
        };
        medium: {
          solved: number;
          total: number;
        };
        hard: {
          solved: number;
          total: number;
        };
      };
    }>('/solved');
  }

  static async getProblemById(id: string) {
    return this.apiClient.get<ProblemWithBoilerplate>(`/${id}`);
  }

  static async createProblem(
    problem: Omit<
      Problem,
      'id' | 'authorId' | 'createdAt' | 'updatedAt' | 'isValidated'
    >,
  ) {
    return this.apiClient.post<{
      problem: Problem;
      boilerplates: Boilerplate[];
    }>('/', problem);
  }

  static async validateProblem(
    problemId: string,
    data: { solution: string; language: SupportedLanguage },
  ) {
    return this.apiClient.post<{ tokens: string[] }>(
      `/${problemId}/validate`,
      data,
    );
  }
}
export default ProblemService;
