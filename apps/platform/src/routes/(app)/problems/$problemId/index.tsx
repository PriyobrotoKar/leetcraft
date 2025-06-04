import { createFileRoute } from '@tanstack/react-router';
import SolutionForm from './-components/SolutionForm';

export const Route = createFileRoute('/(app)/problems/$problemId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const problemId = Route.useParams().problemId;

  return <SolutionForm id={problemId} />;
}
