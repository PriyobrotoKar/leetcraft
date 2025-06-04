import ProblemService from '@/api/services/problem';
import { cn } from '@/lib/utils';
import { Problem } from '@leetcraft/db';
import { Input } from '@leetcraft/ui/components/input';
import { Separator } from '@leetcraft/ui/components/separator';
import { IconSearch } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function TableActions() {
  const [items, setItems] = useState<Problem[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const tags = new Map<string, number>();

  items.forEach((item) => {
    item.tags.forEach((tag) => {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    });
  });

  useEffect(() => {
    const fetchItems = async () => {
      const data = (await queryClient.fetchQuery({
        queryKey: ['problems'],
        queryFn: () => ProblemService.getProblems(),
      })) as Problem[];
      setItems(data);
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (!items.length) {
      return;
    }
    if (!activeTag) {
      queryClient.setQueryData(['problems'], items);
      return;
    }

    const filteredItems = items.filter((item) => item.tags.includes(activeTag));
    queryClient.setQueryData(['problems'], filteredItems);
  }, [activeTag, items]);

  return (
    <div className="space-y-4">
      <div>
        {Array.from(tags.entries()).map(([tag, count]) => (
          <div
            onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
            key={tag}
            className={cn(
              'text-md hover:bg-border inline-flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-3',
              tag === activeTag && 'bg-border',
            )}
          >
            <span>{tag}</span>
            <span className="text-muted-foreground">{count}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <div className="flex h-8 items-center gap-4">
          <div>{activeTag ? tags.get(activeTag) : items.length} items</div>
          <Separator orientation="vertical" />
          <div className="relative">
            <IconSearch className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
            <Input
              className="h-full border-none pl-8 dark:bg-transparent"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableActions;
