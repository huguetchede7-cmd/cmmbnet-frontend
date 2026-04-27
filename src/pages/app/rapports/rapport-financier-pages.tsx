import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon, TrendingUpIcon, TrendingDownIcon, WalletIcon } from "lucide-react";

export default function RapportFinancierPages() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total dépôts",
      value: "0 FCFA",
      icon: <TrendingUpIcon className="w-5 h-5 text-green-700" />,
      color: "bg-green-50",
    },
    {
      title: "Total retraits",
      value: "0 FCFA",
      icon: <TrendingDownIcon className="w-5 h-5 text-red-600" />,
      color: "bg-red-50",
    },
    {
      title: "Total paiements",
      value: "0 FCFA",
      icon: <WalletIcon className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Solde global",
      value: "0 FCFA",
      icon: <BarChart3Icon className="w-5 h-5 text-purple-600" />,
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div className="flex items-center gap-2">
        <BarChart3Icon className="w-6 h-6 text-green-700" />
        <h1 className="text-2xl font-bold tracking-tight">Rapport financier</h1>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-gray-200 shadow-none">
            <CardContent className="pt-6">
              <div className={`flex items-center gap-4 p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tableau récapitulatif */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Récapitulatif des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Aucune donnée disponible pour le moment.</p>
        </CardContent>
      </Card>
    </div>
  );
}