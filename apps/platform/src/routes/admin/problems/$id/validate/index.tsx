import Header from '@/components/Header';
import { createFileRoute } from '@tanstack/react-router';
import ValidateForm from './-components/ValidateForm';

export const Route = createFileRoute('/admin/problems/$id/validate/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-full flex-col gap-10">
      <Header
        title="Create Problem"
        subtitle="Define a new coding problem with description, constraints, test cases and tags"
      />
      <ValidateForm id={Route.useParams().id} />
    </div>
  );
}
