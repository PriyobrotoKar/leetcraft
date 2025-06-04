import Header from '@/components/Header';
import { createFileRoute } from '@tanstack/react-router';
import ProblemTable from './-components/ProblemTable';
import TableActions from './-components/TableActions';

export const Route = createFileRoute('/(app)/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-10">
      <Header
        title="Problem Library"
        subtitle="Create, update, and organize coding problems across the platform"
      />

      <div className="space-y-4">
        <TableActions />
        <ProblemTable />
      </div>
    </div>
  );
}
