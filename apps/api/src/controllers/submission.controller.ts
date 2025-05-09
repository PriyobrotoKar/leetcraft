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

  submissionCallback: HandleRequest = async (req, res) => {
    const result = await this.submissionService.submissionCallback(req.body);
    res.status(201).json(result);
  };
}

export default SubmissionController;
