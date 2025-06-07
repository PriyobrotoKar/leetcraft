import { createFileRoute, Outlet } from '@tanstack/react-router';
import SolutionActions from './-components/SolutionActions';
import SolutionProvider from '@/providers/SolutionProvider';

export const Route = createFileRoute('/(app)/problems/$problemId')({
  component: ProblemLayout,
});

function ProblemLayout() {
  return (
    <div className="flex h-full flex-col gap-10">
      <SolutionProvider>
        <div className="flex flex-1 flex-col gap-4">
          <SolutionActions />
          <Outlet />
        </div>
      </SolutionProvider>
    </div>
  );
}
