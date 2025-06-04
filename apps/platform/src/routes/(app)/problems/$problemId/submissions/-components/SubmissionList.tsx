import SubmissionService from '@/api/services/submission';
import { cn } from '@/lib/utils';
import { Submission } from '@leetcraft/db';
import {
  IconCircleCheck,
  IconCircleX,
  IconClockHour4,
  IconCpu,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

interface SubmissionListsProps {
  problemId: string;
}

function SubmissionList({ problemId }: SubmissionListsProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['problem', problemId, 'submissions'],
    queryFn: async () =>
      SubmissionService.getAllSubmissionsOfProblem(problemId),
  });

  if (isLoading) {
    return <div>Loading submissions...</div>;
  }

  if (isError || !data) {
    return <div>Error loading submissions.</div>;
  }

  return (
    <div className="bg-card focus-within:ring-ring/50 overflow-hidden rounded-md border focus-within:ring-1">
      <div className="bg-tertiary text-md border-b p-3">Submissions</div>
      <div className="space-y-2 overflow-auto p-3">
        {data.map((submission) => {
          return (
            <Link
              className="block"
              to="/problems/$problemId/submissions/$id"
              params={{
                problemId,
                id: submission.id,
              }}
            >
              <SubmissionCard submission={submission} key={submission.id} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

interface SubmissionCardProps {
  submission: Submission;
}

function SubmissionCard({ submission }: SubmissionCardProps) {
  const isAccepted = submission.status ? submission.status <= 3 : false;

  return (
    <div
      className={cn(
        'border-l-destructive bg-tertiary flex items-center justify-between gap-4 rounded-md border-l p-2',
        isAccepted && 'border-l-green-500',
      )}
    >
      <div className="flex items-center gap-2">
        {isAccepted ? (
          <IconCircleCheck className={'size-8 text-green-500'} />
        ) : (
          <IconCircleX className={'text-destructive size-8'} />
        )}
        <div className="space-y-1">
          <div
            className={cn('text-destructive', isAccepted && 'text-green-500')}
          >
            {submission.message}
          </div>
          <div className="text-muted-foreground text-sm">
            {new Date(submission.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="text-muted-foreground bg-muted rounded-md px-2 py-1 text-sm">
        {submission.language}
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <IconClockHour4 className="size-4" /> {submission.time} ms
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <IconCpu className="size-4" />{' '}
          {((submission.memory ?? 0) / Math.pow(2, 20)).toFixed(2)} mb
        </div>
      </div>
    </div>
  );
}

export default SubmissionList;
