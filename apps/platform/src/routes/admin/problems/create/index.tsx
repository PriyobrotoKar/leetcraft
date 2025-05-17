import Header from '@/components/Header';
import { createFileRoute } from '@tanstack/react-router';
import Actions from './-components/Actions';
import BasicInfoForm from './-components/BasicInfoForm';

export const Route = createFileRoute('/admin/problems/create/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-10">
      <Header
        title="Create Problem"
        subtitle="Define a new coding problem with description, constraints, test cases and tags"
      />
      <div className="space-y-4">
        <Actions />
        <BasicInfoForm />
      </div>
    </div>
  );
}
