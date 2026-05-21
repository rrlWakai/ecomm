import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

export function AdminGuard({ children }: { children: JSX.Element }) {
  const { isLoading, isAdmin } = useAuthStore();
  if (isLoading) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
