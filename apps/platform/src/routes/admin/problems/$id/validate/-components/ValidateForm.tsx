import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@leetcraft/ui/components/drawer';
import Actions from '../../../create/-components/Actions';
import MarkdownTextarea from '../../../create/-components/MarkdownTextarea';
import ProblemService from '@/api/services/problem';
import CodeEditor from '../../../create/-components/CodeEditor';
import TestCases from './TestCases';
import { useState } from 'react';
import { SupportedLanguage } from '@leetcraft/boilerplate-generator';
import { toast } from 'sonner';
import ExecuteCodeService, {
  ExecuteCodeResponse,
} from '@/api/services/execute-code';
import { pollWithRetry } from '@/lib/utils';
import { IconCircleX, IconLoader2 } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

interface ValidateFormProps {
  id: string;
}

function ValidateForm({ id }: ValidateFormProps) {
  const [solution, setSolution] = useState<{
    solution: string;
    language: SupportedLanguage;
  }>();
  const [failedResult, setFailedResult] = useState<ExecuteCodeResponse | null>(
    null,
  );
  const [passedTestCases, setPassedTestCases] = useState(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => ProblemService.getProblemById(id),
  });

  const { mutate, isPending: IsSubmitting } = useMutation({
    mutationFn: async () => {
      if (!solution?.solution || !solution.language) {
        throw new Error('Solution is required');
      }
      const data = await ProblemService.validateProblem(id, solution);

      return await pollWithRetry(async () => {
        const res = await ExecuteCodeService.validate(data);
        if (res.pending) {
          throw new Error('Validation is still pending');
        }
        return res.results;
      }, 10);
    },
    onSuccess: async (data) => {
      const failedResults = data.filter((result) => result.status > 3);

      if (failedResults.length > 0) {
        setFailedResult(failedResults[0]!);
        setPassedTestCases(data.length - failedResults.length);
      } else {
        setFailedResult(null);
        setPassedTestCases(data.length);

        await queryClient.invalidateQueries({
          queryKey: ['problems'],
        });

        navigate({
          to: `/admin/problems/${id}/complete`,
          search: {
            testcases: data.length,
          },
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    // TODO: Add a loading spinner or skeleton
    return (
      <div className="flex flex-1 items-center justify-center">
        <IconLoader2 className="animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>Error loading problem: {error?.message || 'Unknown error'}</div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Actions isPending={IsSubmitting} onSubmit={mutate} />
      <div className="flex flex-1 items-stretch gap-6">
        <div className="bg-card focus-within:ring-ring/50 flex-1 gap-0 overflow-hidden rounded-md border focus-within:ring-1">
          <div className="bg-tertiary text-md border-b p-3">Description</div>
          <MarkdownTextarea preview defaultValue={data.description} />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <CodeEditor
            title="Solution"
            boilerplates={data.boilerplates}
            onChange={(value, language) =>
              setSolution({ solution: value || '', language })
            }
          />
          <TestCases structure={data.structure} testCases={data.testcases} />
        </div>
      </div>
      <CodeResultDrawer
        failedResult={failedResult}
        setFailedResult={setFailedResult}
        totalTestCases={data.testcases.length}
        passedTestCases={passedTestCases}
      />
    </div>
  );
}

interface CodeResultDrawerProps {
  failedResult: ExecuteCodeResponse | null;
  totalTestCases: number;
  passedTestCases: number;
  setFailedResult: (failedResult: ExecuteCodeResponse | null) => void;
}

function CodeResultDrawer({
  failedResult,
  totalTestCases,
  passedTestCases,
  setFailedResult,
}: CodeResultDrawerProps) {
  const failedTestCases = totalTestCases - passedTestCases;

  const errorType = failedResult
    ? failedResult.status === 4
      ? 'wrong'
      : failedResult.status >= 6 && failedResult.status <= 12
        ? 'runtime'
        : 'unknown'
    : undefined;

  return (
    <Drawer
      open={!!failedResult}
      onOpenChange={(open) => !open && setFailedResult(null)}
    >
      <DrawerContent className="gap-10 pb-16">
        <DrawerHeader className="mx-auto w-full max-w-6xl flex-row items-center justify-between">
          <DrawerTitle className="text-destructive flex items-center gap-2 text-lg">
            <IconCircleX className="size-7" />{' '}
            <span>{failedResult?.message}</span>
          </DrawerTitle>
          <div className="flex items-center gap-4">
            <div className="space-x-1">
              {Array(passedTestCases).fill(
                <span className="inline-block h-6 w-1 rounded-full bg-green-500"></span>,
              )}
              {Array(failedTestCases).fill(
                <span className="bg-border inline-block h-6 w-1 rounded-full"></span>,
              )}
            </div>
            <span className="text-muted-foreground inline-block text-sm">
              {passedTestCases}/{failedTestCases} Testcases Passed
            </span>
          </div>
        </DrawerHeader>

        <div className="mx-auto flex w-full max-w-6xl gap-4">
          {errorType !== 'runtime' && (
            <div className="bg-card focus-within:ring-ring/50 flex flex-1 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
              <div className="bg-tertiary text-md border-b p-3">Input</div>
              <div className="flex-1 p-3">
                <pre className="bg-background h-full max-h-40 overflow-auto rounded-md border px-4 py-3">
                  {failedResult?.input || 'No input provided'}
                </pre>
              </div>
            </div>
          )}

          {errorType !== 'unknown' && (
            <div className="bg-card focus-within:ring-ring/50 flex flex-1 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
              <div className="bg-tertiary text-md border-b p-3">Output</div>
              <div className="flex-1 p-3">
                <pre className="bg-background text-destructive h-full max-h-40 overflow-auto rounded-md border px-4 py-3">
                  {failedResult?.output ||
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
                  {failedResult?.expectedOutput || 'No output provided'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ValidateForm;
