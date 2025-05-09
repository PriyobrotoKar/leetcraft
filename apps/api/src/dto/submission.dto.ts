import z from 'zod';
import { ExecuteCodeSchema } from './exceute-code.dto';

export const SubmissionSchema = ExecuteCodeSchema.omit({
  testcases: true,
});
export type SubmissionDto = z.infer<typeof SubmissionSchema>;
