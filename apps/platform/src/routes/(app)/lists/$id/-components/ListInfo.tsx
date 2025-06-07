import PlaylistService from '@/api/services/playlist';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@leetcraft/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@leetcraft/ui/components/dialog';
import {
  IconEdit,
  IconPlayerPlayFilled,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import UpdateListDialog from './UpdateListDialog';

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
    return null;
  }

  if (isError || !data) {
    // TODO: Add an error message or fallback UI
    return <div>Error loading Playlist</div>;
  }

  //TODO: Count problems by difficulty
  const totalStats = {
    easy: data.problems.filter((p) => p.difficulty === 'EASY').length,
    medium: data.problems.filter((p) => p.difficulty === 'MEDIUM').length,
    hard: data.problems.filter((p) => p.difficulty === 'HARD').length,
  };

  const solvedProblems = data.problems.filter((p) => p.solvedBy.length === 1);

  const solvedStats = {
    easy: solvedProblems.filter((p) => p.difficulty === 'EASY').length,
    medium: solvedProblems.filter((p) => p.difficulty === 'MEDIUM').length,
    hard: solvedProblems.filter((p) => p.difficulty === 'HARD').length,
  };

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
          <Link
            to={'/problems/$problemId'}
            params={{
              problemId: data.problems[0]?.id ?? '',
            }}
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            <IconPlayerPlayFilled />
            Practice
          </Link>
          <UpdateListDialog
            playlist={data}
            trigger={
              <Button size={'icon'} variant={'tertiary'}>
                <IconEdit />
              </Button>
            }
          />
          <DeleteListDialog playlistId={data.id} />
        </div>
      </div>

      <div className="flex flex-1 gap-8">
        <div className="flex h-full flex-1 flex-col justify-between rounded-md border p-4">
          <h3 className="text-green-500">Easy</h3>
          <div>
            <span className="text-lg">{solvedStats.easy}</span>/
            <span className="text-muted-foreground">{totalStats.easy}</span>
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col justify-between rounded-md border p-4">
          <h3 className="text-yellow-500">Medium</h3>
          <div>
            <span className="text-lg">{solvedStats.medium}</span>/
            <span className="text-muted-foreground">{totalStats.medium}</span>
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col justify-between rounded-md border p-4">
          <h3 className="text-destructive">Hard</h3>
          <div>
            <span className="text-lg">{solvedStats.hard}</span>/
            <span className="text-muted-foreground">{totalStats.hard}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListInfo;

interface DeleteListDialogProps {
  playlistId: string;
}

function DeleteListDialog({ playlistId }: DeleteListDialogProps) {
  const navigate = useNavigate({
    from: '/lists/$id',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => await PlaylistService.deletePlaylist(playlistId),
    onSuccess: () => {
      navigate({ to: '/' });
    },
    onError: (error) => {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist. Please try again later.');
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button size={'icon'} variant={'tertiary'}>
          <IconTrash />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-6 sm:max-w-sm">
        <DialogTitle>Are you sure?</DialogTitle>

        <p className="text-md text-muted-foreground leading-normal">
          This action will delete the playlist and remove all its associated
          problems. This cannot be undone.
        </p>

        <DialogFooter className="">
          <DialogClose>
            <Button variant={'tertiary'} size={'sm'}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            isLoading={isPending}
            onClick={() => mutate()}
            variant={'destructive'}
            size={'sm'}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
