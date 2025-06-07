import ProblemService from '@/api/services/problem';
import { useSolution } from '@/providers/SolutionProvider';
import TestCases from '@/routes/admin/problems/$id/validate/-components/TestCases';
import CodeEditor from '@/routes/admin/problems/create/-components/CodeEditor';
import MarkdownTextarea from '@/routes/admin/problems/create/-components/MarkdownTextarea';
import { supportedLanguages } from '@leetcraft/boilerplate-generator';
import { IconLoader2 } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface SolutionFormProps {
  id: string;
}

function SolutionForm({ id }: SolutionFormProps) {
  const { setSolution } = useSolution();
  const { data, isLoading, error } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => ProblemService.getProblemById(id),
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setSolution({
      problemId: data.id,
      testcases: data.testcases,
      code: '',
      language: supportedLanguages[0].language,
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <IconLoader2 className="animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return <div>Error loading problem data</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 gap-6">
        <div className="bg-card focus-within:ring-ring/50 flex flex-1 basis-0 flex-col gap-0 overflow-hidden rounded-md border focus-within:ring-1">
          <div className="bg-tertiary text-md border-b p-3">Description</div>
          <MarkdownTextarea
            problem={data}
            preview
            defaultValue={data.description}
          />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <CodeEditor
            title="Solution"
            boilerplates={data.boilerplates}
            onChange={(value, language) =>
              setSolution((prev) => {
                if (!prev) {
                  return null;
                }
                return { ...prev, code: value || '', language };
              })
            }
          />
          <TestCases structure={data.structure} testCases={data.testcases} />
        </div>
      </div>
      {/* <CodeResultDrawer */}
      {/*   failedResult={failedResult} */}
      {/*   setFailedResult={setFailedResult} */}
      {/*   totalTestCases={data.testcases.length} */}
      {/*   passedTestCases={passedTestCases} */}
      {/* /> */}
    </div>
  );
}

export default SolutionForm;
