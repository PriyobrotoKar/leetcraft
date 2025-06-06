import ProblemService from '@/api/services/problem';
import { useQuery } from '@tanstack/react-query';
import DataTable from './DataTable';
import Stats from './Stats';

function SubmissionTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => ProblemService.getProblemsSolvedByUser(),
  });

  if (isLoading) {
    // TODO: Add a loading spinner or skeleton
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    // TODO: Add an error message or fallback UI
    return <div>Error loading problems</div>;
  }

  return (
    <div className="space-y-4">
      <Stats data={data.stats} />
      <DataTable data={data.problems} />
    </div>
  );
}

export default SubmissionTable;
