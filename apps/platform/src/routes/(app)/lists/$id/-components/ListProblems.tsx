import PlaylistService from '@/api/services/playlist';
import ProblemService from '@/api/services/problem';
import DataTable from '@/routes/(app)/-components/DataTable';
import { useQuery } from '@tanstack/react-query';

interface ListProblemsProps {
  playlistId: string;
}

function ListProblems({ playlistId }: ListProblemsProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => PlaylistService.getPlaylistById(playlistId),
  });

  if (isLoading) {
    // TODO: Add a loading spinner or skeleton
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    // TODO: Add an error message or fallback UI
    return <div>Error loading problems</div>;
  }

  return <DataTable data={data.problems} />;
}

export default ListProblems;
