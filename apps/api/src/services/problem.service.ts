import {
  CreateProblemDto,
  UpdateProblemDto,
  ValidateProblemDto,
} from '@/dto/problem.dto';
import { BadRequestError, ForbiddenError, NotFoundError } from '@/lib/ApiError';
import { CurrentUser } from '@/types/auth';
import {
  Boilerplate as BoilerplateType,
  generateBoilerplates,
} from '@leetcraft/boilerplate-generator';
import { db, Prisma, Problem, Boilerplate } from '@leetcraft/db';
import JudgeService from './judge.service';
import redisConnection from '@/config/redis';
import { replaceBoilerpatePlaceholder } from '@/lib/utils';

class ProblemService {
  judge: JudgeService;
  constructor() {
    this.judge = new JudgeService();
  }

  async createProblem(dto: CreateProblemDto, currentUser: CurrentUser) {
    // Generate Boilerplates
    let boilerplates: BoilerplateType[] = [];

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
    const problem = await this.checkAuthorityOverProblem<{
      boilerplates: Boilerplate[];
    }>(problemId, currentUser.id, {
      include: {
        boilerplates: true,
      },
    });

    if (problem.isValidated) {
      throw new BadRequestError('Problem is already validated');
    }

    const boilerplateForSolution = problem.boilerplates.find(
      (boilerplate) => boilerplate.language === dto.language,
    );

    if (!boilerplateForSolution) {
      throw new NotFoundError(
        `Boilerplate not found for language ${dto.language}`,
      );
    }

    // replace the boilerplate with the solution
    const fullSolution = replaceBoilerpatePlaceholder(
      boilerplateForSolution.longCode,
      dto.solution,
    );

    // Validate the solution by running the code along with the test cases
    const submissions = problem.testcases.map((testcase) => ({
      source_code: fullSolution,
      language_id: boilerplateForSolution.languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
      callback_url: `http://host.docker.internal:8000/api/v1/problems/${problemId}/validate/callback`,
    }));

    const judgeResponse = await this.judge.submitBatch(submissions);
    const tokens = judgeResponse.map((response) => response.token);

    console.log(Object.fromEntries(tokens.map((token) => [token, 0])));

    await redisConnection.del(`validate:problem:${problemId}`);

    return {
      tokens,
    };
  }

  async validateProblemCallback(body: any, problemId: string) {
    console.log('Callback body:', body);
    const isAccepted = Number(body.status.id === 3);

    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
      select: {
        testcases: true,
      },
    });

    if (!problem) {
      throw new NotFoundError('Problem not found');
    }

    await redisConnection.hsetnx(
      `validate:problem:${problemId}`,
      body.token,
      isAccepted,
    );

    const allTokens = await redisConnection.hgetall(
      `validate:problem:${problemId}`,
    );

    const hasAllReceived =
      Object.keys(allTokens).length === problem.testcases.length;

    console.log(Object.keys(allTokens).length, problem.testcases.length);

    if (!hasAllReceived) {
      console.log('Not all submission received yet');

      return {
        message:
          'Problem validate callback received but not all testcases received yet',
      };
    }

    const isAllAccepted = Object.values(allTokens).every((value) =>
      Number(value),
    );

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

  async getAllProblems(currentUser: CurrentUser) {
    const problems = await db.problem.findMany({
      where: {
        isValidated: true,
      },
      include: {
        solvedBy: {
          where: {
            id: currentUser.id,
          },
        },
      },
    });

    return problems;
  }

  async getProblemById(problemId: string) {
    //TODO: If the user is Admin, then we should return the problem including the ones that are not validated, otherwise only validated Problems

    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
      include: {
        boilerplates: true,
      },
    });

    if (!problem) {
      throw new NotFoundError('Problem not found');
    }

    return problem;
  }

  async getAllProblemsSolvedByUser(currentUser: CurrentUser) {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            id: currentUser.id,
          },
        },
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        tags: true,
      },
    });
    const grouped = await db.problem.groupBy({
      by: ['difficulty'],
      _count: { _all: true },
    });

    const result = {
      total: grouped.reduce((acc, g) => acc + g._count._all, 0),
      easy: grouped.find((g) => g.difficulty === 'EASY')?._count._all || 0,
      medium: grouped.find((g) => g.difficulty === 'MEDIUM')?._count._all || 0,
      hard: grouped.find((g) => g.difficulty === 'HARD')?._count._all || 0,
    };

    const stats = {
      problems: {
        total: result.total,
        solved: problems.length,
      },
      easy: {
        total: result.easy,
        solved: problems.filter((p) => p.difficulty === 'EASY').length,
      },
      medium: {
        total: result.medium,
        solved: problems.filter((p) => p.difficulty === 'MEDIUM').length,
      },
      hard: {
        total: result.hard,
        solved: problems.filter((p) => p.difficulty === 'HARD').length,
      },
    };

    return {
      problems,
      stats,
    };
  }

  async getProblemsCreatedByUser(currentUser: CurrentUser) {
    const problems = await db.problem.findMany({
      where: {
        authorId: currentUser.id,
      },
    });

    return problems;
  }

  async updateProblem(
    dto: UpdateProblemDto,
    problemId: string,
    currentUser: CurrentUser,
  ) {
    await this.checkAuthorityOverProblem(problemId, currentUser.id);

    // TODO: Updating structure and testcases is not allowed at the moment. Have to implement this later as this is not a priority.
    if (dto.structure) {
      throw new BadRequestError(
        'Updating structure is not allowed at the moment',
      );
    }

    if (dto.testcases) {
      throw new BadRequestError(
        'Updating testcases is not allowed at the moment',
      );
    }

    const problem = await db.problem.update({
      where: {
        id: problemId,
      },
      data: {
        ...dto,
      },
    });

    return problem;
  }

  async deleteProblem(problemId: string, currentUser: CurrentUser) {
    await this.checkAuthorityOverProblem(problemId, currentUser.id);

    await db.problem.delete({
      where: {
        id: problemId,
      },
    });

    return {
      message: 'Problem deleted successfully',
    };
  }

  private async checkAuthorityOverProblem<T>(
    problemId: string,
    userId: string,
    query?: Omit<Prisma.ProblemFindUniqueArgs, 'where'>,
  ): Promise<T & Problem> {
    const problem = (await db.problem.findUnique({
      where: {
        id: problemId,
      },
      ...query,
    })) as T & Problem;

    if (!problem) {
      throw new NotFoundError('Problem not found');
    }

    if (problem.authorId !== userId) {
      throw new ForbiddenError('You are not the author of this problem');
    }

    return problem;
  }
}

export default ProblemService;
