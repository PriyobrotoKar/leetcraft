import { useAuth } from '@/providers/AuthProvider';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)')({
  component: AuthLayout,
});

function AuthLayout() {
  const { auth } = useAuth();

  console.log('AuthLayout', auth);

  if (auth.user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
