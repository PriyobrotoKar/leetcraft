import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/problems/$problemId/submissions/')(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return (
    <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2">
      <h1 className="text-lg">Submissions</h1>
      <p className="text-sm">Select a submission to view details</p>
    </div>
  );
}
