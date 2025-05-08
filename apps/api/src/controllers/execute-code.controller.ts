import { ExecuteCodeDto, ValidateCodeDto } from '@/dto/exceute-code.dto';
import ExecuteService from '@/services/execute-code.service';
import { HandleRequest } from '@/types/request';

class ExecuteController {
  private readonly executeService: ExecuteService;
  constructor() {
    this.executeService = new ExecuteService();
  }

  executeCode: HandleRequest<ExecuteCodeDto> = async (req, res) => {
    const result = await this.executeService.executeCode(req.body, req.user);

    res.status(200).json(result);
  };

  validateCode: HandleRequest<ValidateCodeDto> = async (req, res) => {
    const result = await this.executeService.validateCode(req.body);

    res.status(200).json(result);
  };
}

export default ExecuteController;
