"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  LayoutDashboardIcon,
  UsersIcon,
  UserIcon,
  WalletIcon,
  ArrowRightLeftIcon,
  CreditCardIcon,
  BarChart3Icon,
  SettingsIcon,
} from "lucide-react"

import { routeHelpers } from "@/helpers/routeHelpers.ts"

/**
 * MENU MICROFINANCE
 */
const data = {
  navMain: [
     {
      title: "Tableau de bord",
      url: "/dashboard/home",
      icon: <LayoutDashboardIcon />,
     },

    {
      title: "Clients",
      icon: <UsersIcon />,
      items: [
      { title: "Liste des clients", url: "/dashboard/clients" },
      { title: "Ajouter client", url: "/dashboard/clients/create" },
      { title: "Groupes", url: "/dashboard/groupes" },
      ],
    },

    {
      title: "Comptes",
      icon: <UserIcon />,
      items: [
        { title: "Comptes clients", url: routeHelpers.dashboard.comptes.index },
        { title: "Ouvrir un compte", url: routeHelpers.dashboard.comptes.create },
      ],
    },

    {
      title: "Épargne",
      icon: <WalletIcon />,
      items: [
        { title: "Dépôts", url: routeHelpers.dashboard.epargne.depots.index },
        { title: "Retraits", url: routeHelpers.dashboard.epargne.retraits.index },
      ],
    },

    {
      title: "Transactions",
      icon: <ArrowRightLeftIcon />,
      items: [
        { title: "Historique", url: routeHelpers.dashboard.transactions.historique.index },
        { title: "Transfert", url: routeHelpers.dashboard.transactions.transfert.index },
      ],
    },

    {
      title: "Paiements",
      icon: <CreditCardIcon />,
      items: [
        { title: "Paiements clients", url: routeHelpers.dashboard.paiements.index },
        { title: "Factures", url: routeHelpers.dashboard.paiements.factures.index },
      ],
    },

    {
      title: "Rapports",
      icon: <BarChart3Icon />,
      items: [
        { title: "Rapport financier", url: routeHelpers.dashboard.rapports.financier.index },
        { title: "Épargne", url: routeHelpers.dashboard.rapports.epargne.index },
      ],
    },

     {
      title: "Utilisateurs",
      url: "/dashboard/administrator",
     icon: <SettingsIcon />,
    },

    {
      title: "Paramètres",
      url: "/settings",
      icon: <SettingsIcon />,
    },
  ],
}

/**
 * SIDEBAR MICROFINANCE
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}