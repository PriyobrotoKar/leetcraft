import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@leetcraft/ui/components/button';
import { IconCircleCheck } from '@tabler/icons-react';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/problems/$id/complete/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    testcases: Number(search.testcases) || 0,
  }),
});

function RouteComponent() {
  const { testcases } = Route.useSearch();

  return (
    <div className="flex min-h-full flex-col gap-10">
      <Header
        title="Create Problem"
        subtitle="Define a new coding problem with description, constraints, test cases and tags"
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="space-y-2">
          <IconCircleCheck className="mx-auto size-7 text-green-500" />
          <h2 className="text-lg text-green-500">Verified</h2>
          <p className="text-muted-foreground text-sm">
            {testcases}/{testcases} Testcases Passed
          </p>
        </div>

        <p className="max-w-md">
          Your problem has been successfully verified and published publicly to
          be solved by users in this platform.
        </p>

        <div className="space-x-4">
          <Link
            to="/admin/dashboard"
            className={cn(buttonVariants({ variant: 'tertiary' }))}
          >
            Dashboard
          </Link>
          <Link to="/" className={cn(buttonVariants({ variant: 'default' }))}>
            View Problem
          </Link>
        </div>
      </div>
    </div>
  );
}
