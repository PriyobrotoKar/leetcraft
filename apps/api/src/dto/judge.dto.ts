export type SubmissionDto = {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  callback_url?: string;
};

export type SubmissionResponseDto = {
  token: string;
  stdin: string | null;
  stdout: string | null;
  stderr: string | null;
  compile_output: string;
  expected_output: string | null;
  message: string;
  time: string;
  memory: number;
  status: {
    id: number;
    description: string;
  };
};
