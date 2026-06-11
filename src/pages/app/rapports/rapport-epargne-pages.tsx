import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, UsersIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";

type Compte = {
  id: string;
  numero_compte: string;
  type_compte: string;
  solde: number;
  solde_initial: number;
  status: string;
  date_ouverture: string;
  client?: { last_name: string; first_name: string; member_number: string };
};

type Depot = {
  id: string;
  montant: number;
  date_depot: string;
};

type Retrait = {
  id: string;
  montant: number;
  date_retrait: string;
};

export default function RapportEpargnePages() {
  const { user } = useAuth();
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(true);
  const [totaux, setTotaux] = useState({
    totalEpargnants: 0,
    totalEpargne: 0,
    depotsMois: 0,
    retraitsMois: 0,
  });

  const getMoisActuel = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les comptes
        const resComptes = await apiService.get(
          { url: apiRoutes.admin.app.comptes.list, params: { limit: 100 } },
          { userToken: (user as any)?.token ?? "", hasNoSuccessModal: true }
        );
        const listeComptes: Compte[] = resComptes?.data?.list ?? [];
        setComptes(listeComptes);

        // Récupérer les dépôts
        const resDepots = await apiService.get(
          { url: apiRoutes.admin.app.depots.list, params: { limit: 1000 } },
          { userToken: (user as any)?.token ?? "", hasNoSuccessModal: true }
        );
        const listeDepots: Depot[] = resDepots?.data?.list ?? [];

        // Récupérer les retraits
        const resRetraits = await apiService.get(
          { url: apiRoutes.admin.app.retraits.list, params: { limit: 1000 } },
          { userToken: (user as any)?.token ?? "", hasNoSuccessModal: true }
        );
        const listeRetraits: Retrait[] = resRetraits?.data?.list ?? [];

        const moisActuel = getMoisActuel();

        const depotsMois = listeDepots
          .filter((d) => d.date_depot?.startsWith(moisActuel))
          .reduce((sum, d) => sum + Number(d.montant), 0);

        const retraitsMois = listeRetraits
          .filter((r) => r.date_retrait?.startsWith(moisActuel))
          .reduce((sum, r) => sum + Number(r.montant), 0);

        const totalEpargne = listeComptes.reduce((sum, c) => sum + Number(c.solde), 0);

        setTotaux({
          totalEpargnants: listeComptes.length,
          totalEpargne,
          depotsMois,
          retraitsMois,
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: "Total épargnants",
      value: totaux.totalEpargnants.toString(),
      icon: <UsersIcon className="w-5 h-5 text-green-700" />,
      color: "bg-green-50",
    },
    {
      title: "Total épargne",
      value: `${totaux.totalEpargne.toLocaleString()} FCFA`,
      icon: <WalletIcon className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Dépôts du mois",
      value: `${totaux.depotsMois.toLocaleString()} FCFA`,
      icon: <TrendingUpIcon className="w-5 h-5 text-green-700" />,
      color: "bg-green-50",
    },
    {
      title: "Retraits du mois",
      value: `${totaux.retraitsMois.toLocaleString()} FCFA`,
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
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : comptes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">Membre</th>
                    <th className="py-3 px-4">N° Membre</th>
                    <th className="py-3 px-4">N° Compte</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Solde initial</th>
                    <th className="py-3 px-4">Solde actuel</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {comptes.map((compte) => (
                    <tr key={compte.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        {compte.client
                          ? `${compte.client.last_name} ${compte.client.first_name}`
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {compte.client?.member_number ?? '-'}
                      </td>
                      <td className="py-3 px-4">{compte.numero_compte}</td>
                      <td className="py-3 px-4">{compte.type_compte}</td>
                      <td className="py-3 px-4">
                        {Number(compte.solde_initial).toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4 font-bold text-green-700">
                        {Number(compte.solde).toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          compte.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {compte.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}