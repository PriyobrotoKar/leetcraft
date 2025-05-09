import { SubmissionDto } from '@/dto/submission.dto';
import ProblemService from './problem.service';
import { replaceBoilerpatePlaceholder } from '@/lib/utils';
import { NotFoundError } from '@/lib/ApiError';
import { db } from '@leetcraft/db';
import { CurrentUser } from '@/types/auth';
import JudgeService from './judge.service';

class SubmissionService {
  problemService: ProblemService;
  judgeService: JudgeService;
  constructor() {
    this.problemService = new ProblemService();
    this.judgeService = new JudgeService();
  }

  async createSubmission(dto: SubmissionDto, currentUser: CurrentUser) {
    // Get the problem by ID
    const problem = await this.problemService.getProblemById(dto.problemId);

    // Get the boilerplate code for the language
    const boilerplate = problem.boilerplates.find(
      (boilerplate) => boilerplate.language === dto.language,
    );

    if (!boilerplate) {
      throw new NotFoundError(
        `Boilerplate not found for language ${dto.language}`,
      );
    }

    // Replace the boilerplate placeholder with the actual code
    const solution = replaceBoilerpatePlaceholder(
      boilerplate.longCode,
      dto.code,
    );

    // Create a submisson in db
    const submission = await db.submission.create({
      data: {
        solution,
        language: boilerplate.language,
        problemId: problem.id,
        userId: currentUser.id,
      },
    });

    // Create the submission batch with respect to each testcase
    const submissionBatch = problem.testcases.map((testcase) => ({
      source_code: solution,
      language_id: boilerplate.languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
      callback_url: `http://host.docker.internal:8000/api/v1/submissions/${submission.id}/callback`,
    }));

    // Submit the batch of submissions to the judge
    const tokens = await this.judgeService.submitBatch(submissionBatch);

    return {
      tokens: tokens.map((submission) => submission.token),
    };
  }

  async submissionCallback(body: any) {
    const data = {
      ...body,
      stderr: atob(body.stderr),
      message: atob(body.message),
    };

    console.log('Submission callback data:', data);

    return {
      message: 'Submission callback received',
    };
  }
}

export default SubmissionService;
