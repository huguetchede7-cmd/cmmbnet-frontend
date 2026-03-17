import { AppSidebar } from "@/components/app-sidebar.tsx"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth.ts"

export default function DashboardLayout() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user?.token) {
      navigate('/dashboard/logout');
      return;
    }
  }, [isAuthenticated, user, navigate]);


  return (
    <TooltipProvider>
      <SidebarProvider>

        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 ">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}