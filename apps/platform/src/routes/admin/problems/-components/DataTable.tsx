import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { columns } from './Columns';
import { Problem } from '@leetcraft/db';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@leetcraft/ui/components/table';
import { cn } from '@leetcraft/ui/lib/utils';
import { useNavigate } from '@tanstack/react-router';

interface DataTableProps {
  data: Problem[];
}

function DataTable({ data }: DataTableProps) {
  const navigate = useNavigate({
    from: '/admin/problems',
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table className="border-separate border-spacing-0">
        <TableHeader className="bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none">
              {headerGroup.headers.map((header, i) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'border-y',
                      i === 0 && 'rounded-l-md border-l',
                      i === headerGroup.headers.length - 1 &&
                        'rounded-r-md border-r',
                    )}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() =>
                  navigate({
                    to: `/admin/problems/${row.original.id}/validate`,
                  })
                }
              >
                {row.getVisibleCells().map((cell, i, cells) => (
                  <TableCell
                    className={cn(
                      'text-md',
                      i === 0 && 'rounded-l-md',
                      i === cells.length - 1 && 'rounded-r-md',
                    )}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
