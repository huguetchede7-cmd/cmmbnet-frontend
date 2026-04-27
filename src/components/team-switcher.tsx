"use client"

import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          {"CMMB"}
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">CMMB Microfinance</span>
          <span className="truncate text-xs">@Admin</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenu>
  )
}
