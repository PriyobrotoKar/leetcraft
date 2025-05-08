export type SubmissionDto = {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  callback_url?: string;
};

export type SubmissionResponseDto = {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string;
  message: string;
  status: {
    id: number;
    description: string;
  };
};
