import { SubmissionDto } from '@/dto/submission.dto';
import ProblemService from './problem.service';
import { replaceBoilerpatePlaceholder } from '@/lib/utils';
import { NotFoundError } from '@/lib/ApiError';
import { db } from '@leetcraft/db';
import { CurrentUser } from '@/types/auth';
import JudgeService from './judge.service';
import redisConnection from '@/config/redis';

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
        solution: dto.code,
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
      submissionId: submission.id,
    };
  }

  async submissionCallback(body: any, submissionId: string) {
    const data = {
      ...body,
      stderr: atob(body.stderr),
      message: atob(body.message),
    };

    const submission = await db.submission.findUnique({
      where: {
        id: submissionId,
      },
      select: {
        problem: {
          select: {
            testcases: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    const isAccepted = Number(body.status.id === 3);

    await redisConnection.hsetnx(
      `validate:submission:${submissionId}`,
      body.token,
      isAccepted,
    );

    const allTokens = await redisConnection.hgetall(
      `validate:submission:${submissionId}`,
    );

    const hasAllSubmissionReceived =
      Object.keys(allTokens).length === submission.problem.testcases.length;

    console.log(
      Object.keys(allTokens).length,
      submission.problem.testcases.length,
    );

    if (!hasAllSubmissionReceived) {
      console.log('Not all submission received yet');

      return {
        message:
          'Submission callback received but not all testcases received yet',
      };
    }

    const isAllAccepted = Object.values(allTokens).every((value) =>
      Number(value),
    );

    if (isAllAccepted) {
      const passedSubmissionData = await this.judgeService.getSubmission(
        body.token,
      );

      const index =
        passedSubmissionData.stdout
          ?.slice(0, passedSubmissionData.stdout.length - 1)
          .lastIndexOf('\n') ?? 0;

      const output = passedSubmissionData.stdout?.slice(index + 1);
      const stdout = passedSubmissionData.stdout?.slice(0, index + 1);

      await db.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          status: passedSubmissionData.status.id,
          message: passedSubmissionData.status.description,
          time: Number(passedSubmissionData.time) * 1000,
          memory: passedSubmissionData.memory,
          stderr: passedSubmissionData.stderr,
          stdin: passedSubmissionData.stdin,
          stdout,
          output,
          exptectedOutput: passedSubmissionData.expected_output,
          testsPassed: submission.problem.testcases.length,
        },
      });
      await db.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          status: body.status.id,
          message: body.status.description,
          time: Number(body.time) * 1000,
          memory: body.memory,
          stderr: body.stderr,
          stdin: body.stdin,
          stdout: body.stdout,
          output: body.output,
          exptectedOutput: body.expected_output,
          testsPassed: submission.problem.testcases.length,
        },
      });

      return {
        message: 'Submission accepted',
      };
    }

    const failedSubmissionToken = Object.keys(allTokens).find(
      (key) => Number(allTokens[key]) === 0,
    ) as string;

    const failedSubmissionData = await this.judgeService.getSubmission(
      failedSubmissionToken,
    );

    const index =
      failedSubmissionData.stdout
        ?.slice(0, failedSubmissionData.stdout.length - 1)
        .lastIndexOf('\n') ?? 0;

    const output = failedSubmissionData.stdout?.slice(index + 1);
    const stdout = failedSubmissionData.stdout?.slice(0, index + 1);

    const testsPassed = Object.values(allTokens).filter(
      (value) => Number(value) === 1,
    ).length;

    await db.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        status: failedSubmissionData.status.id,
        message: failedSubmissionData.status.description,
        time: Number(failedSubmissionData.time) * 1000,
        memory: failedSubmissionData.memory,
        stderr: failedSubmissionData.stderr,
        stdin: failedSubmissionData.stdin,
        stdout,
        output,
        exptectedOutput: failedSubmissionData.expected_output,
        testsPassed,
      },
    });

    return {
      message: 'Submission callback received',
    };
  }

  getSubmissionById = async (
    submissionId: string,
    currentUser: CurrentUser,
  ) => {
    const submission = await db.submission.findUnique({
      where: {
        id: submissionId,
        userId: currentUser.id,
      },
    });

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    if (!submission.status) {
      return {
        submission,
        pending: true,
      };
    }

    return {
      submission,
      pending: false,
    };
  };
}

export default SubmissionService;
