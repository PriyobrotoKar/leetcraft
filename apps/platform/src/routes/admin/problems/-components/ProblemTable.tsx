import ProblemService from '@/api/services/problem';
import { useQuery } from '@tanstack/react-query';
import DataTable from './DataTable';
import TableActions from './TableActions';

function ProblemTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['problems'],
    queryFn: () => ProblemService.getProblemsCreated(),
  });

  if (isLoading) {
    // TODO: Add a loading spinner or skeleton
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    // TODO: Add an error message or fallback UI
    return <div>Error loading problems</div>;
  }

  return <DataTable data={data} />;
}

export default ProblemTable;
