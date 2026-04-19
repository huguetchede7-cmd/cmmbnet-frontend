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
  BanknoteIcon,
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
      url: routeHelpers.dashboard.index,
      icon: <LayoutDashboardIcon />,
    },

    {
      title: "Clients",
      icon: <UsersIcon />,
      items: [
        { title: "Liste des clients", url: routeHelpers.dashboard.clients.index},
        { title: "Ajouter client", url:routeHelpers.dashboard.clients.create },
        { title: "Groupes", url: "/clients/groups" },
      ],
    },

    {
      title: "Comptes",
      icon: <UserIcon />,
      items: [
        { title: "Comptes clients", url: "/accounts" },
        { title: "Ouvrir un compte", url: "/accounts/create" },
      ],
    },

    {
      title: "Épargne",
      icon: <WalletIcon />,
      items: [
        { title: "Dépôts", url: "/savings/deposits" },
        { title: "Retraits", url: "/savings/withdrawals" },
      ],
    },

    {
      title: "Crédits",
      icon: <BanknoteIcon />,
      items: [
        { title: "Demandes de crédit", url: "/loans" },
        { title: "Accorder un crédit", url: "/loans/create" },
        { title: "Remboursements", url: "/loans/repayments" },
      ],
    },

    {
      title: "Transactions",
      icon: <ArrowRightLeftIcon />,
      items: [
        { title: "Historique", url: "/transactions" },
        { title: "Transfert", url: "/transactions/transfer" },
      ],
    },

    {
      title: "Paiements",
      icon: <CreditCardIcon />,
      items: [
        { title: "Paiements clients", url: "/payments" },
        { title: "Factures", url: "/payments/invoices" },
      ],
    },

    {
      title: "Rapports",
      icon: <BarChart3Icon />,
      items: [
        { title: "Rapport financier", url: "/reports/finance" },
        { title: "Crédits", url: "/reports/loans" },
        { title: "Épargne", url: "/reports/savings" },
      ],
    },

    {
      title: "Utilisateurs",
      url: routeHelpers.dashboard.administrator.index,
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