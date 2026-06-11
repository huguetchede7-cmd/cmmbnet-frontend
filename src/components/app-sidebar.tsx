"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon, UsersIcon, UserIcon, WalletIcon,
  ArrowRightLeftIcon, BarChart3Icon, SettingsIcon,
} from "lucide-react"
import { routeHelpers } from "@/helpers/routeHelpers.ts"
import { useAuth } from "@/lib/auth.ts"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userSlugs: string[] = ((user as any)?.roles ?? []).map((r: any) => r?.slug ?? '');

  const isAdmin = userSlugs.includes('admin') || userSlugs.length === 0;
  const isSavingsOfficer = userSlugs.includes('savings_officer');
  const isCashier = userSlugs.includes('cashier');

  const canSee = (slugs: string[]) => {
    if (isAdmin) return true;
    return slugs.some(s => userSlugs.includes(s));
  };

  const navMain = [
    // Tableau de bord — visible par tous
    {
      title: "Tableau de bord",
      url: "/dashboard/home",
      icon: <LayoutDashboardIcon />,
    },

    // Membres — Admin et Chargé d'épargne
    ...(canSee(['clients', 'savings_officer']) ? [{
      title: "Membres",
      icon: <UsersIcon />,
      items: [
        { title: "Liste des membres", url: "/dashboard/clients" },
        { title: "Ajouter membre", url: "/dashboard/clients/create" },
      ],
    }] : []),

    // Comptes — Admin et Chargé d'épargne
    ...(canSee(['comptes', 'savings_officer']) ? [{
      title: "Comptes",
      icon: <UserIcon />,
      items: [
        { title: "Comptes membres", url: routeHelpers.dashboard.comptes.index },
        { title: "Ouvrir un compte", url: routeHelpers.dashboard.comptes.create },
      ],
    }] : []),

    // Épargne — Admin, Chargé d'épargne et Caissier
    ...(canSee(['epargne', 'savings_officer', 'cashier']) ? [{
      title: "Épargne",
      icon: <WalletIcon />,
      items: [
        { title: "Dépôts", url: routeHelpers.dashboard.epargne.depots.index },
        { title: "Retraits", url: routeHelpers.dashboard.epargne.retraits.index },
      ],
    }] : []),

    // Transactions — Admin, Chargé d'épargne et Caissier
    ...(canSee(['transactions', 'savings_officer', 'cashier']) ? [{
      title: "Transactions",
      icon: <ArrowRightLeftIcon />,
      items: [
        { title: "Historique", url: routeHelpers.dashboard.transactions.historique.index },
      ],
    }] : []),

    // Rapports — Admin et chargé d'épargne
    ...(canSee(['rapports', 'savings_officer']) ? [{
      title: "Rapports",
      icon: <BarChart3Icon />,
      items: [
        { title: "Rapport financier", url: routeHelpers.dashboard.rapports.financier.index },
        { title: "Épargne", url: routeHelpers.dashboard.rapports.epargne.index },
      ],
    }] : []),

    // Paramètres — Admin uniquement
    ...(isAdmin ? [{
      title: "Paramètres",
      url: "/dashboard/parametres",
      icon: <SettingsIcon />,
    }] : []),
  ];

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="
        text-white
        [&_[data-sidebar=sidebar]]:bg-gradient-to-b
        [&_[data-sidebar=sidebar]]:from-[#022c22]
        [&_[data-sidebar=sidebar]]:via-[#065f46]
        [&_[data-sidebar=sidebar]]:to-[#047857]
      "
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}