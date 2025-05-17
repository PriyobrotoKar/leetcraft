import { useAuth } from '@/providers/AuthProvider';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { auth } = useAuth();

  console.log('DashboardLayout', auth);

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
