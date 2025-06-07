import Header from '@/components/Header';
import { createFileRoute } from '@tanstack/react-router';
import ListInfo from './-components/ListInfo';
import ListProblems from './-components/ListProblems';

export const Route = createFileRoute('/(app)/lists/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-col gap-10">
      <Header
        title="Playlists"
        subtitle="Manage and Solve problems from custom lists"
      />
      <ListInfo playlistId={Route.useParams().id} />
      <ListProblems playlistId={Route.useParams().id} />
    </div>
  );
}
