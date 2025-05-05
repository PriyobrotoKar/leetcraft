import ProblemService from '@/services/problem.service';
import { Request, Response } from 'express';

class ProblemController {
  private readonly problemService: ProblemService;

  constructor() {
    this.problemService = new ProblemService();
  }

  createProblem = async (req: Request, res: Response) => {
    const problem = await this.problemService.createProblem(req.body, req.user);
    res.status(201).json(problem);
  };

  getAllProblems = async (req: Request, res: Response) => {
    const problems = await this.problemService.getAllProblems();
    res.status(200).json(problems);
  };

  getProblemsCreatedByUser = async (req: Request, res: Response) => {
    const problems = await this.problemService.getProblemsCreatedByUser(
      req.user,
    );
    res.status(200).json(problems);
  };
}

export default ProblemController;
