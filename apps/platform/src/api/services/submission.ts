import { SupportedLanguage } from '@leetcraft/boilerplate-generator';
import ApiClient from '../client';
import { Prisma, Submission } from '@leetcraft/db';

export type SubmissionWithTestcases = Prisma.SubmissionGetPayload<{
  include: {
    problem: {
      select: {
        testcases: true;
      };
    };
  };
}>;

class SubmissionService {
  private static apiClient: ApiClient = new ApiClient('/submissions');

  static async createSubmission(data: {
    problemId: string;
    code: string;
    language: SupportedLanguage;
  }) {
    return this.apiClient.post<{ submissionId: string }>('/', data);
  }

  static async getAllSubmissionsOfProblem(problemId: string) {
    return this.apiClient.get<Submission[]>(`/?problemId=${problemId}`);
  }

  static async getSubmissionById(id: string) {
    return this.apiClient.get<{
      submission: SubmissionWithTestcases;
      pending: boolean;
    }>(`/${id}`);
  }
}

export default SubmissionService;
