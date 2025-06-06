import { useAuth } from '@/providers/AuthProvider';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import Sidebar from './-components/Sidebar';

export const Route = createFileRoute('/(app)')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { auth } = useAuth();

  console.log('DashboardLayout', auth);

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-svh gap-3 p-5">
      <Sidebar />
      <div className="bg-surface flex-1 basis-0 rounded-lg border px-6 py-5">
        <Outlet />
      </div>
    </div>
  );
}
