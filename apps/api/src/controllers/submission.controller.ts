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

  submissionCallback: HandleRequest<any, { id: string }> = async (req, res) => {
    const result = await this.submissionService.submissionCallback(
      req.body,
      req.params.id,
    );
    res.status(201).json(result);
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
