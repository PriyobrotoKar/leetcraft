import { Prisma, Problem } from '@leetcraft/db';
import ApiClient from '../client';

type ProblemWithBoilerplate = Prisma.ProblemGetPayload<{
  include: {
    boilerplates: true;
  };
}>;

class ProblemService {
  private static apiClient: ApiClient = new ApiClient('/problems');

  static async getProblemsCreated() {
    return this.apiClient.get<Problem[]>('/created');
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
    return this.apiClient.post<Problem>('/', problem);
  }
}
export default ProblemService;
