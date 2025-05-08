import { Languages } from '@leetcraft/boilerplate-generator';
import z from 'zod';

export const ExecuteCodeSchema = z.object({
  problemId: z.string().nonempty(),
  code: z.string().nonempty(),
  language: z.nativeEnum(Languages),
  testcases: z
    .array(
      z.object({
        input: z.string().nonempty(),
        output: z.string().nonempty(),
      }),
    )
    .nonempty('At least one test case is required'),
});
export type ExecuteCodeDto = z.infer<typeof ExecuteCodeSchema>;

export const ValidateCodeSchema = z.object({
  tokens: z.array(z.string().nonempty()).nonempty(),
});
export type ValidateCodeDto = z.infer<typeof ValidateCodeSchema>;
