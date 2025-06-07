import { createFileRoute } from '@tanstack/react-router';
import ProfileInfo from './-components/ProfileInfo';
import SubmissionTable from './-components/SubmissionTable';
import Activity from './-components/Activity';

export const Route = createFileRoute('/(app)/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full gap-4">
      <ProfileInfo />
      <div className="flex h-full flex-1 basis-0 flex-col gap-8">
        <Activity />
        <SubmissionTable />
      </div>
    </div>
  );
}
