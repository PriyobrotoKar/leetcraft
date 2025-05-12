import { createFileRoute } from '@tanstack/react-router';
import SignupForm from './-components/SignupForm';

export const Route = createFileRoute('/(auth)/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <SignupForm />
    </div>
  );
}
