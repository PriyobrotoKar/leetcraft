import ProblemService from '@/api/services/problem';
import { Problem } from '@leetcraft/db';
import { Button, buttonVariants } from '@leetcraft/ui/components/button';
import { Input } from '@leetcraft/ui/components/input';
import { Separator } from '@leetcraft/ui/components/separator';
import { cn } from '@leetcraft/ui/lib/utils';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

function TableActions() {
  const [items, setItems] = useState<Problem[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchItems = async () => {
      const data = (await queryClient.fetchQuery({
        queryKey: ['problems'],
        queryFn: () => ProblemService.getProblemsCreated(),
      })) as Problem[];
      setItems(data);
    };

    fetchItems();
  }, []);

  return (
    <div className="flex justify-between">
      <div className="flex h-8 items-center gap-4">
        <div>{items.length} items</div>
        <Separator orientation="vertical" />
        <div className="relative">
          <IconSearch className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
          <Input
            className="h-full border-none pl-8 dark:bg-transparent"
            placeholder="Search..."
          />
        </div>
      </div>
      <Link
        className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
        to="/admin/problems/create"
      >
        <IconPlus /> Add Problem
      </Link>
    </div>
  );
}

export default TableActions;
