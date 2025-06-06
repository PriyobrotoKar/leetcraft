import {
  CreateProblemDto,
  UpdateProblemDto,
  ValidateProblemDto,
} from '@/dto/problem.dto';
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

  getAllProblems: HandleRequest = async (req, res) => {
    const problems = await this.problemService.getAllProblems(req.user);
    res.status(200).json(problems);
  };

  getProblemById: HandleRequest<{ id: string }> = async (req, res) => {
    const problem = await this.problemService.getProblemById(req.params.id);
    res.status(200).json(problem);
  };

  getAllProblemsSolvedByUser: HandleRequest = async (req, res) => {
    const problems = await this.problemService.getAllProblemsSolvedByUser(
      req.user,
    );
    res.status(200).json(problems);
  };

  getProblemsCreatedByUser: HandleRequest = async (req, res) => {
    const problems = await this.problemService.getProblemsCreatedByUser(
      req.user,
    );
    res.status(200).json(problems);
  };

  updateProblem: HandleRequest<UpdateProblemDto, { id: string }> = async (
    req,
    res,
  ) => {
    const problem = await this.problemService.updateProblem(
      req.body,
      req.params.id,
      req.user,
    );
    res.status(200).json(problem);
  };

  deleteProblem: HandleRequest<{ id: string }> = async (req, res) => {
    await this.problemService.deleteProblem(req.params.id, req.user);
    res.status(204).json();
  };
}

export default ProblemController;
