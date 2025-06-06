import PlaylistService from '@/api/services/playlist';
import ProblemService from '@/api/services/problem';
import { cn } from '@/lib/utils';
import { Button } from '@leetcraft/ui/components/button';
import { Checkbox } from '@leetcraft/ui/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@leetcraft/ui/components/dropdown-menu';
import { Label } from '@leetcraft/ui/components/label';
import { IconPlus, IconStar } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CreateListDialog from './CreateListDialog';

interface AddToPlaylistDropdownProps {
  problemId: string;
}

function AddToPlaylistDropdown({ problemId }: AddToPlaylistDropdownProps) {
  const queryClient = useQueryClient();

  const {
    data: allPlaylists,
    isLoading: allPlaylistsLoading,
    isError: allPlaylistsError,
  } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => PlaylistService.getPlaylists(),
  });

  const {
    data: problemInPlaylists,
    isLoading: problemInPlaylistsLoading,
    isError: problemInPlaylistsError,
  } = useQuery({
    queryKey: ['playlists', problemId],
    queryFn: () =>
      PlaylistService.getPlaylists({
        problemId,
      }),
  });

  const { mutate: addProblem } = useMutation({
    mutationFn: async (data: {
      playlistId: string;
      problemId: string;
      playlistName: string;
    }) => PlaylistService.addProblemToPlaylist(data.playlistId, data.problemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['playlists', variables.problemId],
      });
      toast.success(`Problem added to ${variables.playlistName}`);
    },
    onError: (error) => {
      console.error('Error adding problem to playlist:', error);
      toast.error('Failed to add problem to playlist');
    },
  });

  const { mutate: removeProblem } = useMutation({
    mutationFn: async (data: {
      playlistId: string;
      problemId: string;
      playlistName: string;
    }) =>
      PlaylistService.removeProblemFromPlaylist(
        data.playlistId,
        data.problemId,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['playlists', variables.problemId],
      });
      toast.success(`Problem removed from ${variables.playlistName}`);
    },
    onError: (error) => {
      console.error('Error removing problem from playlist:', error);
      toast.error('Failed to remove problem from playlist');
    },
  });

  if (allPlaylistsLoading || problemInPlaylistsLoading) {
    return;
  }

  if (
    allPlaylistsError ||
    problemInPlaylistsError ||
    !allPlaylists ||
    !problemInPlaylists
  ) {
    return;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="hover:bg-muted data-[state=open]:bg-muted opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
          size={'icon'}
          variant={'ghost'}
        >
          <IconStar className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="end">
        <DropdownMenuLabel>Add to List</DropdownMenuLabel>
        <div className="h-52 overflow-auto">
          {allPlaylists.map((playlist) => {
            console.log('playlist', playlist);
            console.log(
              problemInPlaylists.some((list) => list.id === playlist.id),
            );
            return (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onSelect={(e) => e.preventDefault()}
              >
                <Checkbox
                  checked={problemInPlaylists.some(
                    (list) => list.id === playlist.id,
                  )}
                  onCheckedChange={(checked) =>
                    checked
                      ? addProblem({
                          playlistId: playlist.id,
                          problemId,
                          playlistName: playlist.name,
                        })
                      : removeProblem({
                          playlistId: playlist.id,
                          problemId,
                          playlistName: playlist.name,
                        })
                  }
                  id={`check-${playlist.id}`}
                />
                <Label className="w-full" htmlFor={`check-${playlist.id}`}>
                  {playlist.name}
                </Label>
              </DropdownMenuItem>
            );
          })}
        </div>
        <DropdownMenuSeparator />
        <CreateListDialog
          trigger={
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={(e) => e.preventDefault()}
            >
              <IconPlus /> Create New Playlist
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AddToPlaylistDropdown;
