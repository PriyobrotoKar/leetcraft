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

  static async getAllSubmissions(filters?: { problemId?: string }) {
    return this.apiClient.get<Submission[]>('/', filters);
  }

  static async getSubmissionById(id: string) {
    return this.apiClient.get<{
      submission: SubmissionWithTestcases;
      pending: boolean;
    }>(`/${id}`);
  }

  static async getStreak() {
    return this.apiClient.get<{ date: string; count: number; level: number }[]>(
      '/streak',
    );
  }
}

export default SubmissionService;
