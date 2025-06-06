import { Problem } from '@leetcraft/db';
import { Button } from '@leetcraft/ui/components/button';
import { IconCheck, IconStar } from '@tabler/icons-react';
import { ColumnDef, Getter } from '@tanstack/react-table';

export const columns: ColumnDef<
  Pick<Problem, 'id' | 'title' | 'difficulty' | 'tags'>
>[] = [
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
];
