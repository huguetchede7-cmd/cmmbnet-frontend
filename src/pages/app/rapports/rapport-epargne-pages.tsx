import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, UsersIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

export default function RapportEpargnePages() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total épargnants",
      value: "0",
      icon: <UsersIcon className="w-5 h-5 text-green-700" />,
      color: "bg-green-50",
    },
    {
      title: "Total épargne",
      value: "0 FCFA",
      icon: <WalletIcon className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Dépôts du mois",
      value: "0 FCFA",
      icon: <TrendingUpIcon className="w-5 h-5 text-green-700" />,
      color: "bg-green-50",
    },
    {
      title: "Retraits du mois",
      value: "0 FCFA",
      icon: <TrendingDownIcon className="w-5 h-5 text-red-600" />,
      color: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div className="flex items-center gap-2">
        <WalletIcon className="w-6 h-6 text-green-700" />
        <h1 className="text-2xl font-bold tracking-tight">Rapport d'épargne</h1>
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

      {/* Tableau épargne */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Détail de l'épargne par compte</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Aucune donnée disponible pour le moment.</p>
        </CardContent>
      </Card>
    </div>
  );
}