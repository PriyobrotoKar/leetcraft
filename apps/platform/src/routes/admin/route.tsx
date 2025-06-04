import { useAuth } from '@/providers/AuthProvider';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import Sidebar from './-components/Sidebar';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const { auth } = useAuth();

  console.log('AdminLayout', auth);

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  if (auth.user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-svh gap-3 p-5">
      <Sidebar />
      <div className="bg-surface flex-1 rounded-lg border px-6 py-5">
        <Outlet />
      </div>
    </div>
  );
}
