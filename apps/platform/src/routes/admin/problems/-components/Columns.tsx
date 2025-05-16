import { Problem } from '@leetcraft/db';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<
  Pick<Problem, 'title' | 'difficulty' | 'createdAt' | 'isValidated'>
>[] = [
  {
    accessorKey: 'title',
    header: 'Name',
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
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    },
  },
  {
    accessorKey: 'isValidated',
    header: 'Validated',
    cell: ({ getValue }) => {
      const isValidated = getValue() as boolean;

      return (
        <div className="w-fit rounded-md bg-green-500/30 px-3 py-1.5 text-green-500">
          {isValidated ? 'Verified' : 'Unverified'}
        </div>
      );
    },
  },
];
