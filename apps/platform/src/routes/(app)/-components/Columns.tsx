import { IconCheck } from '@tabler/icons-react';
import { ColumnDef, Getter } from '@tanstack/react-table';
import AddToPlaylistDropdown from './AddToPlaylistDropdown';
import { PlaylistWithProblems } from '@/api/services/playlist';

export const columns: ColumnDef<PlaylistWithProblems['problems'][number]>[] = [
  {
    id: 'status',
    size: 50,
    cell: ({ row }) => {
      const isSolved = row.original.solvedBy?.length === 1;
      return (
        <span className="inline-flex w-full justify-center" role="checkbox">
          {isSolved && <IconCheck className="text-green-500" />}
        </span>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'title',
    header: 'Name',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ getValue }: { getValue: Getter<string[]> }) => {
      return (
        <div className="flex gap-2">
          {getValue().map((tag, index) => {
            return (
              <span
                key={index}
                className="inline-flex items-center gap-2 rounded-sm border px-2 py-1 text-sm"
              >
                {tag}
              </span>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
    cell: ({ getValue }) => {
      const difficulty = getValue() as string;

      return (
        <div className="text-green-500">
          {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
        </div>
      );
    },
  },
  {
    id: 'addToPlaylist',
    size: 50,
    cell: ({ row }) => {
      const problemId = row.original.id;

      return <AddToPlaylistDropdown problemId={problemId} />;
    },
  },
];
