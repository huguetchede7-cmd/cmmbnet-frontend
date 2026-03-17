import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "@/lib/auth.ts"
import { routeHelpers } from "@/helpers/routeHelpers.ts"


export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={routeHelpers.dashboard.home} replace />;
  }

  return (
    <div className={`flex min-h-screen items-center justify-center font-sans`}>
      <div className="w-full max-w-lg lg:w-1/2">
          <Outlet />
      </div>
    </div>
  );
}