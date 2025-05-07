import { CreateProblemDto, ValidateProblemDto } from '@/dto/problem.dto';
import { BadRequestError } from '@/lib/ApiError';
import { CurrentUser } from '@/types/auth';
import {
  Boilerplate,
  generateBoilerplates,
} from '@leetcraft/boilerplate-generator';
import { db } from '@leetcraft/db';
import {
  JsonArray,
  JsonObject,
  JsonValue,
} from '@leetcraft/db/prisma/generated/client/runtime/library';
import JudgeService from './judge.service';
import redisConnection from '@/config/redis';

class ProblemService {
  judge: JudgeService;
  constructor() {
    this.judge = new JudgeService();
  }

  async createProblem(dto: CreateProblemDto, currentUser: CurrentUser) {
    // Generate Boilerplates
    let boilerplates: Boilerplate[] = [];

    try {
      boilerplates = generateBoilerplates(dto.structure);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }

    // Create the problem and boilerplates
    const problem = await db.problem.create({
      data: {
        ...dto,
        authorId: currentUser.id,
        boilerplates: {
          createMany: {
            data: boilerplates.map((boilerplate) => ({
              languageId: boilerplate.id,
              language: boilerplate.language,
              shortCode: boilerplate.short_code,
              longCode: boilerplate.long_code,
            })),
          },
        },
      },
    });

    return {
      problem,
      boilerplates,
    };
  }

  async validateProblem(
    dto: ValidateProblemDto,
    problemId: string,
    currentUser: CurrentUser,
  ) {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
      include: {
        boilerplates: true,
      },
    });

    if (!problem) {
      throw new BadRequestError('Problem not found');
    }

    if (problem.authorId !== currentUser.id) {
      throw new BadRequestError('You are not the author of this problem');
    }

    if (problem.isValidated) {
      throw new BadRequestError('Problem is already validated');
    }

    const boilerplateForSolution = problem.boilerplates.find(
      (boilerplate) => boilerplate.language === dto.language,
    );

    if (!boilerplateForSolution) {
      throw new BadRequestError('Boilerplate not found for the given language');
    }

    // replace the boilerplate with the solution
    const fullSolution = boilerplateForSolution.longCode.replace(
      '##USER CODE GOES HERE##',
      dto.solution,
    );

    console.log('Full Solution:', fullSolution);

    // Validate the solution by running the code along with the test cases
    const submissions = problem.testcases.map((testcase) => ({
      source_code: fullSolution,
      language_id: boilerplateForSolution.languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
      callback_url: `http://host.docker.internal:8000/api/v1/problem/${problemId}/validate/callback`,
    }));

    const judgeResponse = await this.judge.submitBatch(submissions);
    const tokens = judgeResponse.map((response) => response.token);

    console.log(Object.fromEntries(tokens.map((token) => [token, 0])));

    await redisConnection.del(`validate:${problemId}`);

    return {
      tokens,
    };
  }

  async validateProblemCallback(body: any, problemId: string) {
    console.log('Callback body:', body);
    const isAccepted = Number(body.status.id === 3);

    await redisConnection.hsetnx(
      `validate:${problemId}`,
      body.token,
      isAccepted,
    );

    const allTokens = await redisConnection.hgetall(`validate:${problemId}`);

    console.log('All Tokens:', allTokens);

    const isAllAccepted = Object.values(allTokens).every((value) =>
      Number(value),
    );

    console.log('Is all accepted:', isAllAccepted);

    if (isAllAccepted) {
      await db.problem.update({
        where: {
          id: problemId,
        },
        data: {
          isValidated: true,
        },
      });
    }

    return {
      message: `Problem ID: ${problemId} has been validated successfully`,
    };
  }

  async getAllProblems() {
    const problems = await db.problem.findMany({
      where: {
        isValidated: true,
      },
    });

    return problems;
  }

  async getProblemsCreatedByUser(currentUser: CurrentUser) {
    const problems = await db.problem.findMany({
      where: {
        authorId: currentUser.id,
      },
    });

    return problems;
  }
}

export default ProblemService;
