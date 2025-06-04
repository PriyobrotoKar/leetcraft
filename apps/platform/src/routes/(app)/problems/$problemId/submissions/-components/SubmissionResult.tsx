import { SubmissionWithTestcases } from '@/api/services/submission';
import { cn } from '@/lib/utils';
import CodeEditor from '@/routes/admin/problems/create/-components/CodeEditor';
import { SupportedLanguage } from '@leetcraft/boilerplate-generator';
import { Submission } from '@leetcraft/db';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

interface SubmissionResultProps {
  submission: SubmissionWithTestcases;
}

function SubmissionResult({ submission }: SubmissionResultProps) {
  const isAccepted = submission.status ? submission.status <= 3 : false;

  const errorType =
    submission.status && !isAccepted
      ? submission.status === 4
        ? 'wrong'
        : submission.status >= 6 && submission.status <= 12
          ? 'runtime'
          : 'unknown'
      : undefined;

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-end gap-6">
        <div className="flex items-center gap-2">
          {!isAccepted ? (
            <div className="text-destructive flex items-center gap-2">
              <IconCircleX className="size-7" />{' '}
              <span>{submission.message}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-500">
              <IconCircleCheck className="size-7" />
              <span>Accepted</span>
            </div>
          )}
        </div>
        <div className="text-muted-foreground text-sm">
          {submission.testsPassed}/{submission.problem.testcases.length}{' '}
          Testcases Passed
        </div>
      </div>

      {!isAccepted && (
        <div className="mx-auto flex w-full max-w-6xl gap-4">
          {errorType !== 'runtime' && (
            <div className="bg-card focus-within:ring-ring/50 flex flex-1 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
              <div className="bg-tertiary text-md border-b p-3">Input</div>
              <div className="flex-1 p-3">
                <pre className="bg-background h-full max-h-40 overflow-auto rounded-md border px-4 py-3">
                  {submission?.stdin || 'No input provided'}
                </pre>
              </div>
            </div>
          )}

          {errorType !== 'unknown' && (
            <div className="bg-card focus-within:ring-ring/50 flex flex-1 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
              <div className="bg-tertiary text-md border-b p-3">Output</div>
              <div className="flex-1 p-3">
                <pre
                  className={cn(
                    'bg-background text-destructive h-full max-h-40 overflow-auto rounded-md border px-4 py-3',
                  )}
                >
                  {submission.output || 'No output received'}
                </pre>
              </div>
            </div>
          )}

          {errorType !== 'runtime' && (
            <div className="bg-card focus-within:ring-ring/50 flex flex-1 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
              <div className="bg-tertiary text-md border-b p-3">
                Expected Output
              </div>
              <div className="flex-1 p-3">
                <pre className="bg-background h-full max-h-40 overflow-auto rounded-md border px-4 py-3">
                  {submission.expectedOutput || 'No output provided'}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <CodeEditor
        value={submission.solution}
        language={submission.language as SupportedLanguage}
        onChange={() => {}}
        title="Solution"
        readOnly
      />
    </div>
  );
}

export default SubmissionResult;
