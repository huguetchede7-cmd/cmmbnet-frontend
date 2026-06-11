import { AppSidebar } from "@/components/app-sidebar.tsx"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/lib/auth.ts"

export default function DashboardLayout() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userRoles: string[] = ((user as any)?.roles ?? []).map((r: any) => r?.slug ?? '');
  const isAdmin = userRoles.includes('admin') || userRoles.length === 0;

  useEffect(() => {
    if (!isAuthenticated || !(user as any)?.token) {
      navigate('/dashboard/logout');
      return;
    }

    // Protection des routes réservées à l'admin
    const adminOnlyRoutes = ['/dashboard/parametres', '/dashboard/administrator'];
    const isAdminRoute = adminOnlyRoutes.some(route => location.pathname.startsWith(route));

    if (isAdminRoute && !isAdmin) {
      navigate('/dashboard/home');
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}