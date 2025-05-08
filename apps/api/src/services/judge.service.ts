import { SubmissionDto, SubmissionResponseDto } from '@/dto/judge.dto';

class JudgeService {
  baseUrl = 'http://localhost:2358';

  constructor() {}

  async submitBatch(
    submissions: SubmissionDto[],
  ): Promise<{ token: string }[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/submissions/batch?base64_encoded=false`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            submissions,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to submit batch');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error('Error while submitting batch:', error.meesage);
    }
  }

  async validateBatch(tokens: string[]): Promise<SubmissionResponseDto[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/submissions/batch?base64_encoded=false&tokens=${tokens.join(',')}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to validate batch');
      }

      const data = await response.json();
      return data.submissions;
    } catch (error: any) {
      throw new Error('Error while validating batch:', error.meesage);
    }
  }
}

export default JudgeService;
