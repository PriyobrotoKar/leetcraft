import { useQuery } from '@tanstack/react-query';
import Actions from '../../../create/-components/Actions';
import MarkdownTextarea from '../../../create/-components/MarkdownTextarea';
import ProblemService from '@/api/services/problem';
import CodeEditor from '../../../create/-components/CodeEditor';
import TestCases from './TestCases';

interface ValidateFormProps {
  id: string;
}

function ValidateForm({ id }: ValidateFormProps) {
  const { data, isPending, error } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => ProblemService.getProblemById(id),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return (
      <div>Error loading problem: {error?.message || 'Unknown error'}</div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Actions isPending={false} onSubmit={() => {}} />
      <div className="flex flex-1 items-stretch gap-6">
        <div className="bg-card focus-within:ring-ring/50 flex-1 gap-0 overflow-hidden rounded-md border focus-within:ring-1">
          <div className="bg-tertiary text-md border-b p-3">Description</div>
          <MarkdownTextarea preview defaultValue={data.description} />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <CodeEditor
            title="Solution"
            boilerplates={data.boilerplates}
            onChange={() => {}}
          />
          <TestCases structure={data.structure} testCases={data.testcases} />
        </div>
      </div>
    </div>
  );
}

export default ValidateForm;
