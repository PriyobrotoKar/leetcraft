import {
  SupportedLanguage,
  supportedLanguages,
} from '@leetcraft/boilerplate-generator';
import { Difficulty } from '@leetcraft/db';
import z from 'zod';

export const CreateProblemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.nativeEnum(Difficulty),
  tags: z.array(z.string()).optional(),
  structure: z.string().min(1, 'Structure is required'),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
      }),
    )
    .min(1, 'At least one test case is required'),
});

export type CreateProblemDto = z.infer<typeof CreateProblemSchema>;

const Languages = Object.fromEntries(
  supportedLanguages.map((lang) => [lang.language, lang.language]),
) as Record<SupportedLanguage, SupportedLanguage>;

export const ValidateProblemSchema = z.object({
  solution: z.string().min(1, 'Solution is required'),
  language: z.nativeEnum(Languages),
});

export type ValidateProblemDto = z.infer<typeof ValidateProblemSchema>;

export const UpdateProblemSchema = CreateProblemSchema.partial();
export type UpdateProblemDto = z.infer<typeof UpdateProblemSchema>;
