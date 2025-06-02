import { ExecuteCodeDto, ValidateCodeDto } from '@/dto/exceute-code.dto';
import { CurrentUser } from '@/types/auth';
import ProblemService from './problem.service';
import { replaceBoilerpatePlaceholder } from '@/lib/utils';
import { NotFoundError } from '@/lib/ApiError';
import JudgeService from './judge.service';

class ExecuteService {
  private readonly problemService: ProblemService;
  private readonly judgeService: JudgeService;
  constructor() {
    this.problemService = new ProblemService();
    this.judgeService = new JudgeService();
  }

  async executeCode(dto: ExecuteCodeDto, currentUser: CurrentUser) {
    // check if the problem exists
    const problem = await this.problemService.getProblemById(dto.problemId);

    // get the long boilerplate code for the language
    const boilerplate = problem.boilerplates.find(
      (boilerplate) => boilerplate.language === dto.language,
    );

    if (!boilerplate) {
      throw new NotFoundError(
        `Boilerplate not found for language ${dto.language}`,
      );
    }

    // replace the placeholders with the user code
    const fullSolution = replaceBoilerpatePlaceholder(
      boilerplate.longCode,
      dto.code,
    );

    // create a batch of submissions
    const submissions = dto.testcases.map((testcase) => ({
      source_code: fullSolution,
      language_id: boilerplate.languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    // submit the batch of submissions to the judge
    const result = await this.judgeService.submitBatch(submissions);
    const tokens = result.map((submission) => submission.token);

    // return the tokens of the submissions
    return {
      tokens,
    };
  }

  async validateCode(dto: ValidateCodeDto) {
    // get the results of the validation
    const results = await this.judgeService.validateBatch(dto.tokens);

    console.log('results', results);

    // check if any one of the submissions is pending
    const pending = results.some((submission) => submission.status.id < 3);

    if (pending) {
      return {
        pending: true,
        results: null,
      };
    }

    // return the results of the validation
    return {
      pending: false,
      results: results.map(
        ({ token, status, stdin, stdout, stderr, expected_output }) => ({
          token,
          input: stdin,
          output: stdout,
          error: stderr,
          expectedOutput: expected_output,
          message: status.description,
          status: status.id,
        }),
      ),
    };
  }
}

export default ExecuteService;
