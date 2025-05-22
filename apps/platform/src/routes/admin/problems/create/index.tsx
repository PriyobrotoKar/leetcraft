import Header from '@/components/Header';
import { createFileRoute } from '@tanstack/react-router';
import Actions from './-components/Actions';
import BasicInfoForm from './-components/BasicInfoForm';

export const Route = createFileRoute('/admin/problems/create/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-full flex-col gap-10">
      <Header
        title="Create Problem"
        subtitle="Define a new coding problem with description, constraints, test cases and tags"
      />
      <BasicInfoForm />
    </div>
  );
}
