import PlaylistService from '@/api/services/playlist';
import DataTable from '@/routes/(app)/-components/DataTable';
import { IconLoader2 } from '@tabler/icons-react';
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

  return <DataTable data={data.problems} />;
}

export default ListProblems;
