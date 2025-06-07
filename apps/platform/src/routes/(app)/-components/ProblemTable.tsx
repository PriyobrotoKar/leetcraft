import ProblemService from '@/api/services/problem';
import { useQuery } from '@tanstack/react-query';
import DataTable from './DataTable';
import { IconLoader, IconLoader2 } from '@tabler/icons-react';

function ProblemTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['problems'],
    queryFn: () => ProblemService.getProblems(),
  });

  if (isLoading) {
    // TODO: Add a loading spinner or skeleton
    return (
      <div className="flex flex-1 items-center justify-center">
        <IconLoader2 className="animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    // TODO: Add an error message or fallback UI
    return <div>Error loading problems</div>;
  }

  return <DataTable data={data} />;
}

export default ProblemTable;
