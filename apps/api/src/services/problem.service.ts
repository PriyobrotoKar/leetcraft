import { CreateProblemDto } from '@/dto/problem.dto';
import { BadRequestError } from '@/lib/ApiError';
import { CurrentUser } from '@/types/auth';
import {
  Boilerplate,
  generateBoilerplates,
} from '@leetcraft/boilerplate-generator';
import { db } from '@leetcraft/db';

class ProblemService {
  constructor() {}

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

    // TODO: Send the problem to judge0 for validating the boilerplates

    return {
      problem,
      boilerplates,
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
