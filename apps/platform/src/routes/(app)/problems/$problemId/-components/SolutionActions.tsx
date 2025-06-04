import ExecuteCodeService, {
  ExecuteCodePayload,
  ExecuteCodeResponse,
} from '@/api/services/execute-code';
import { Button, buttonVariants } from '@leetcraft/ui/components/button';
import {
  IconCircleCheck,
  IconCircleX,
  IconCloudUpload,
  IconPlayerPlayFilled,
} from '@tabler/icons-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@leetcraft/ui/components/drawer';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn, pollWithRetry } from '@/lib/utils';
import { toast } from 'sonner';
import { useSolution } from '@/providers/SolutionProvider';
import SubmissionService from '@/api/services/submission';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { Submission } from '@leetcraft/db';

function SolutionActions() {
  const navigate = useNavigate({
    from: `/problems/$problemId`,
  });
  const { solution } = useSolution();
  const params = useParams({
    from: '/(app)/problems/$problemId',
  });
  const problemId = params.problemId;
  const isAtSubmissionPage = useLocation().pathname.includes('submissions');
  const [results, setResults] = useState<ExecuteCodeResponse[] | null>(null);
  const queryClient = useQueryClient();

  const { mutate: runCodeMutation, isPending: isRunningCode } = useMutation({
    mutationFn: async () => {
      if (!solution || !solution.code || !solution.language) {
        throw new Error('Solution is not complete');
      }
      const data = await ExecuteCodeService.executeCode(solution);

      return await pollWithRetry(async () => {
        const res = await ExecuteCodeService.validate(data);
        if (res.pending) {
          throw new Error('Validation is still pending');
        }
        return res.results;
      }, 10);
    },
    onSuccess: (data) => {
      setResults(data ?? null);
    },
    onError: (error) => {
      console.error('Error executing code:', error);
      toast.error(error.message);
      setResults(null);
    },
  });

  const { mutate: submitMutation, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      if (!solution || !solution.code || !solution.language) {
        throw new Error('Solution is not complete');
      }

      const { submissionId } =
        await SubmissionService.createSubmission(solution);

      return await pollWithRetry(async () => {
        const res = await SubmissionService.getSubmissionById(submissionId);
        if (res.pending) {
          throw new Error('Submissions is still pending');
        }
        return res.submission;
      }, 10);
    },

    onError: (error) => {
      console.error('Error submitting code:', error);
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(
        ['problem', problemId, 'submissions'],
        (oldData: Submission[]) => {
          if (!oldData) {
            return [data];
          }
          return [data, ...oldData];
        },
      );
      navigate({
        to: `submissions/${data.id}`,
      });
    },
  });

  return (
    <div className="flex justify-between">
      <div></div>
      <div className="flex gap-4">
        <Button
          isLoading={isRunningCode}
          onClick={() => runCodeMutation()}
          size={'sm'}
          variant={'tertiary'}
        >
          <IconPlayerPlayFilled />
          Run
        </Button>
        <Button
          size={'sm'}
          onClick={() => submitMutation()}
          isLoading={isSubmitting}
        >
          <IconCloudUpload /> Submit
        </Button>
      </div>
      <div>
        <Link
          className={cn(buttonVariants({ variant: 'tertiary', size: 'sm' }))}
          to={
            !isAtSubmissionPage
              ? '/problems/$problemId/submissions'
              : '/problems/$problemId'
          }
          params={{
            problemId,
          }}
        >
          {!isAtSubmissionPage ? 'Submissions' : 'Back To Problem'}
        </Link>
      </div>
      <CodeResultDrawer results={results} setResults={setResults} />
    </div>
  );
}

interface CodeResultDrawerProps {
  results: ExecuteCodeResponse[] | null;
  setResults: (results: ExecuteCodeResponse[] | null) => void;
}

function CodeResultDrawer({ results, setResults }: CodeResultDrawerProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const failedTestCases = results?.filter((result) => result.status > 3) || [];
  const failedResult = failedTestCases[0];

  const passedTestCases = (results?.length || 0) - failedTestCases.length;

  console.log(failedTestCases.length, results?.length, passedTestCases);

  const errorType = failedResult
    ? failedResult.status === 4
      ? 'wrong'
      : failedResult.status >= 6 && failedResult.status <= 12
        ? 'runtime'
        : 'unknown'
    : undefined;

  return (
    <Drawer
      open={!!results?.length}
      onOpenChange={(open) => !open && setResults(null)}
    >
      <DrawerContent className="gap-10 pb-16">
        <DrawerHeader className="mx-auto w-full max-w-6xl flex-row items-center justify-between p-0">
          <DrawerTitle className="text-lg">
            {failedResult ? (
              <div className="text-destructive flex items-center gap-2">
                <IconCircleX className="size-7" />{' '}
                <span>{failedResult?.message}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-500">
                <IconCircleCheck className="size-7" />
                <span>Accepted</span>
              </div>
            )}
          </DrawerTitle>
          <div className="flex items-center gap-4">
            <div className="space-x-1">
              {Array(passedTestCases).fill(
                <span className="inline-block h-6 w-1 rounded-full bg-green-500"></span>,
              )}
              {Array(failedTestCases.length).fill(
                <span className="bg-border inline-block h-6 w-1 rounded-full"></span>,
              )}
            </div>
            <span className="text-muted-foreground inline-block text-sm">
              {passedTestCases}/{results?.length} Testcases Passed
            </span>
          </div>
        </DrawerHeader>

        {results?.length && (
          <>
            <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-2">
              {results?.map((_, index) => {
                const isWrong =
                  results[index] && failedTestCases.includes(results[index]);

                return (
                  <div
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      'text-md w-fit cursor-pointer rounded-md border border-green-500/30 bg-green-500/20 px-4 py-2 text-green-500 opacity-60 transition-colors hover:bg-green-500/40',
                      activeIndex === index && 'opacity-100',
                      isWrong &&
                        'bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/40',
                    )}
                  >
                    Case {index + 1}
                  </div>
                );
              })}
            </div>

            <div className="mx-auto flex w-full max-w-6xl gap-4">
              {errorType !== 'runtime' && (
                <div className="bg-card focus-within:ring-ring/50 flex flex-1 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
                  <div className="bg-tertiary text-md border-b p-3">Input</div>
                  <div className="flex-1 p-3">
                    <pre className="bg-background h-full max-h-40 overflow-auto rounded-md border px-4 py-3">
                      {results[activeIndex]?.input || 'No input provided'}
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
                        'bg-background h-full max-h-40 overflow-auto rounded-md border px-4 py-3 text-green-500',
                        results[activeIndex] &&
                          failedTestCases.includes(results[activeIndex]) &&
                          'text-destructive',
                      )}
                    >
                      {results[activeIndex]?.output ||
                        failedResult?.error ||
                        'No output received'}
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
                      {results[activeIndex]?.expectedOutput ||
                        'No output provided'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default SolutionActions;
