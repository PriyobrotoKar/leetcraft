import { createFileRoute, Outlet } from '@tanstack/react-router';
import SubmissionList from './-components/SubmissionList';

export const Route = createFileRoute('/(app)/problems/$problemId/submissions')({
  component: SubmissionLayout,
});

function SubmissionLayout() {
  return (
    <div className="flex flex-1 gap-6">
      <SubmissionList problemId={Route.useParams().problemId} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
