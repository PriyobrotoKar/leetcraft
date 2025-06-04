import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import SubmissionResult from '../-components/SubmissionResult';
import SubmissionService from '@/api/services/submission';

export const Route = createFileRoute(
  '/(app)/problems/$problemId/submissions/$id/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const submissionId = Route.useParams().id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: async () => SubmissionService.getSubmissionById(submissionId),
  });

  if (isLoading) {
    return <div>Loading submission...</div>;
  }

  if (isError || !data) {
    return <div>Error loading submission</div>;
  }

  return <SubmissionResult submission={data.submission} />;
}
