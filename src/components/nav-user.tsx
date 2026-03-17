import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, SparklesIcon, BadgeCheckIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"
import { useAuth } from "@/lib/auth.ts"
import { TinyAvatar } from "@/components/useful/AdvancedAvatar.tsx"
import { useState } from "react"
import { routeHelpers } from "@/helpers/routeHelpers.ts"
import { useNavigate } from "react-router-dom"
import { AutoShowDialog } from "@/components/ui/my-alert-dialog.tsx"

export function NavUser() {
  const { user } = useAuth();
  const { isMobile } = useSidebar()
  const navigate = useNavigate();
  const [showLogOutModal, setShowLogOutModal] = useState(false);


  return (
    <div>
      {showLogOutModal && (
        <AutoShowDialog
          title="Déconnexion"
          titleClass="text-red-500"
          message="Si vous quittez, vous perdrez votre session. Souhaitez vous vraiment vous déconnecter."
          onSuccess={() => {
            navigate(routeHelpers.dashboard.logout);
          }}
          successBtnClass="bg-red-500 hover:bg-red-600 text-white"
          onCancel={() => setShowLogOutModal(!showLogOutModal)}
          onDismiss={() => setShowLogOutModal(!showLogOutModal)}
          cancelBtnText="Annuler"
          successBtnText="Déconnexion"
        />
      )}

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <TinyAvatar name={user?.fullname??""} image={null}  size={"sm"}/>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.fullname}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <TinyAvatar name={user?.fullname??""} image={null}  size={"sm"}/>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.fullname}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <SparklesIcon
                  />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheckIcon
                  />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon
                  />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon
                  />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={()=>setShowLogOutModal(true)}>
                <LogOutIcon
                />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
