import { SubmissionDto } from '@/dto/submission.dto';
import SubmissionService from '@/services/submission.service';
import { HandleRequest } from '@/types/request';

class SubmissionController {
  submissionService: SubmissionService;
  constructor() {
    this.submissionService = new SubmissionService();
  }

  createSubmission: HandleRequest<SubmissionDto> = async (req, res) => {
    const result = await this.submissionService.createSubmission(
      req.body,
      req.user,
    );
    res.status(201).json(result);
  };

  submissionCallback: HandleRequest<any, { id: string }, { userId: string }> =
    async (req, res) => {
      const result = await this.submissionService.submissionCallback(
        req.body,
        req.params.id,
        req.query.userId,
      );
      res.status(201).json(result);
    };

  getAllSubmissions: HandleRequest<never, never, { problemId: string }> =
    async (req, res) => {
      const submissions = await this.submissionService.getAllSubmissions(
        req.user,
        req.query,
      );

      res.status(200).json(submissions);
    };

  getStreak: HandleRequest = async (req, res) => {
    const streak = await this.submissionService.getStreak(req.user);
    res.status(200).json(streak);
  };

  getSubmissionById: HandleRequest<never, { id: string }> = async (
    req,
    res,
  ) => {
    const result = await this.submissionService.getSubmissionById(
      req.params.id,
      req.user,
    );
    res.status(200).json(result);
  };
}

export default SubmissionController;
