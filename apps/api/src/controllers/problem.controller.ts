import { CreateProblemDto, ValidateProblemDto } from '@/dto/problem.dto';
import ProblemService from '@/services/problem.service';
import { HandleRequest } from '@/types/request';

class ProblemController {
  private readonly problemService: ProblemService;

  constructor() {
    this.problemService = new ProblemService();
  }

  createProblem: HandleRequest<CreateProblemDto> = async (req, res) => {
    const problem = await this.problemService.createProblem(req.body, req.user);
    res.status(201).json(problem);
  };

  validateProblem: HandleRequest<ValidateProblemDto, { id: string }> = async (
    req,
    res,
  ) => {
    const problem = await this.problemService.validateProblem(
      req.body,
      req.params.id,
      req.user,
    );
    res.status(200).json(problem);
  };

  validateProblemCallback: HandleRequest = async (req, res) => {
    const result = await this.problemService.validateProblemCallback(
      req.body,
      req.params.id,
    );
    res.status(200).json(result);
  };

  getAllProblems: HandleRequest = async (_req, res) => {
    const problems = await this.problemService.getAllProblems();
    res.status(200).json(problems);
  };

  getProblemsCreatedByUser: HandleRequest = async (req, res) => {
    const problems = await this.problemService.getProblemsCreatedByUser(
      req.user,
    );
    res.status(200).json(problems);
  };
}

export default ProblemController;
