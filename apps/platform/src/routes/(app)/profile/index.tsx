import { createFileRoute } from '@tanstack/react-router';
import ProfileInfo from './-components/ProfileInfo';
import SubmissionTable from './-components/SubmissionTable';
import Activity from './-components/Activity';

export const Route = createFileRoute('/(app)/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex gap-4">
      <ProfileInfo />
      <div className="flex-1 basis-0 space-y-8">
        <Activity />
        <SubmissionTable />
      </div>
    </div>
  );
}
