import PlaylistService from '@/api/services/playlist';
import { Button } from '@leetcraft/ui/components/button';
import {
  IconEdit,
  IconPlayerPlayFilled,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

interface ListInfoProps {
  playlistId: string;
}

function ListInfo({ playlistId }: ListInfoProps) {
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
    return <div>Error loading Playlist</div>;
  }

  //TODO: Count problems by difficulty
  //TODO: Add Creator Name

  return (
    <div className="bg-card flex gap-20 rounded-lg border p-4">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg">{data.name}</h2>
          <div className="text-md text-muted-foreground">
            <span>Priyobroto Kar</span> ·{' '}
            <span>{data.problems.length} questions</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size={'sm'}>
            <IconPlayerPlayFilled />
            Practice
          </Button>
          <Button size={'icon'} variant={'tertiary'}>
            <IconPlus />
          </Button>
          <Button size={'icon'} variant={'tertiary'}>
            <IconEdit />
          </Button>
          <Button size={'icon'} variant={'tertiary'}>
            <IconTrash />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-8">
        <div className="flex h-full flex-1 flex-col justify-between rounded-md border p-4">
          <h3 className="text-green-500">Easy</h3>
          <div>
            <span className="text-lg">4</span>/
            <span className="text-muted-foreground">21</span>
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col justify-between rounded-md border p-4">
          <h3 className="text-yellow-500">Medium</h3>
          <div>
            <span className="text-lg">4</span>/
            <span className="text-muted-foreground">21</span>
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col justify-between rounded-md border p-4">
          <h3 className="text-destructive">Hard</h3>
          <div>
            <span className="text-lg">4</span>/
            <span className="text-muted-foreground">21</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListInfo;
