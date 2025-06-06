import SubmissionService from '@/api/services/submission';
import { ActivityCalendar } from 'react-activity-calendar';
import { useQuery } from '@tanstack/react-query';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function Activity() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['activity'],
    queryFn: async () => SubmissionService.getStreak(),
  });

  if (isError) {
    return <div>Error loading activity</div>;
  }

  const startDate = new Date(
    new Date().getFullYear() - 1,
    new Date().getMonth(),
    new Date().getDate() + 1,
  );

  if (data && formatDate(startDate) !== data[0]?.date) {
    data?.unshift({
      date: formatDate(startDate),
      count: 0,
      level: 0,
    });
  }

  if (data && formatDate(new Date()) !== data[data.length - 1]?.date) {
    data?.push({
      date: formatDate(new Date()),
      count: 0,
      level: 0,
    });
  }

  return (
    <div className="space-y-4 rounded-md border p-4 [&>article]:!w-auto [&_svg]:w-full">
      <h3 className="text-base-ui-medium">Streak</h3>
      <ActivityCalendar
        data={data ?? []}
        loading={isLoading}
        labels={{
          totalCount: '{{count}} submissions in past one year',
        }}
      />
    </div>
  );
}

export default Activity;
