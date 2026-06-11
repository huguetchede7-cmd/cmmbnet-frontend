import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, WalletIcon, TrendingUpIcon, TrendingDownIcon, BarChart3Icon, SunIcon } from "lucide-react";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";

type Stats = {
  total_clients: number;
  total_comptes: number;
  total_depots: number;
  total_retraits: number;
  depots_aujourdhui: number;
  retraits_aujourdhui: number;
  derniers_depots: Array<{
    id: string;
    numero_transaction: string;
    montant: number;
    date_depot: string;
    mode_paiement: string;
  }>;
  derniers_retraits: Array<{
    id: string;
    numero_transaction: string;
    montant: number;
    date_retrait: string;
    mode_paiement: string;
  }>;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const userRoles: string[] = ((user as any)?.roles ?? []).map((r: any) => r?.slug ?? '');
  const isCashier = userRoles.includes('cashier') && !userRoles.includes('admin');
  const isAdmin = userRoles.includes('admin') || userRoles.length === 0;

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        { url: apiRoutes.admin.app.dashboard.stats },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setStats(response?.data ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Salutation selon l'heure
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  // Date du jour formatée
  const getDateDuJour = () => {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalOperationsAujourdhui = 
    (stats?.derniers_depots?.length ?? 0) + 
    (stats?.derniers_retraits?.length ?? 0);

  // ========== TABLEAU DE BORD CAISSIER ==========
  if (isCashier) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto p-6">
        {/* Message de bienvenue */}
        <Card className="border border-green-200 bg-gradient-to-r from-green-700 to-green-600 shadow-none text-white">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <SunIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {getGreeting()}, {(user as any)?.fullname} 👋
                </h1>
                <p className="text-green-100 text-sm mt-1">
                  {getDateDuJour()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : (
          <>
            {/* Stats du jour */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-green-200 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUpIcon className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dépôts aujourd'hui</p>
                      <p className="text-2xl font-bold text-green-700">
                        +{Number(stats?.depots_aujourdhui ?? 0).toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-red-200 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <TrendingDownIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Retraits aujourd'hui</p>
                      <p className="text-2xl font-bold text-red-600">
                        -{Number(stats?.retraits_aujourdhui ?? 0).toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dernières opérations ou message vide */}
            {totalOperationsAujourdhui === 0 ? (
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="pt-10 pb-10 text-center">
                  <WalletIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-500">
                    Aucune opération effectuée aujourd'hui
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Les dépôts et retraits effectués apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Derniers dépôts */}
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <TrendingUpIcon className="w-4 h-4 text-green-700" />
                      Derniers dépôts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats?.derniers_depots?.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun dépôt.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="py-2 px-2">N° Transaction</th>
                            <th className="py-2 px-2">Montant</th>
                            <th className="py-2 px-2">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats?.derniers_depots?.map((depot) => (
                            <tr key={depot.id} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-2 font-medium">{depot.numero_transaction}</td>
                              <td className="py-2 px-2 text-green-700 font-medium">+{Number(depot.montant).toLocaleString()} FCFA</td>
                              <td className="py-2 px-2">{depot.date_depot}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </CardContent>
                </Card>

                {/* Derniers retraits */}
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <TrendingDownIcon className="w-4 h-4 text-red-600" />
                      Derniers retraits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats?.derniers_retraits?.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun retrait.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="py-2 px-2">N° Transaction</th>
                            <th className="py-2 px-2">Montant</th>
                            <th className="py-2 px-2">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats?.derniers_retraits?.map((retrait) => (
                            <tr key={retrait.id} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-2 font-medium">{retrait.numero_transaction}</td>
                              <td className="py-2 px-2 text-red-600 font-medium">-{Number(retrait.montant).toLocaleString()} FCFA</td>
                              <td className="py-2 px-2">{retrait.date_retrait}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ========== TABLEAU DE BORD ADMIN ET CHARGÉ D'ÉPARGNE ==========
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground pt-1">
          Vue d'ensemble de la plateforme Microfinance CMMB
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement des statistiques...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border border-gray-200 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UsersIcon className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total membres</p>
                    <p className="text-3xl font-bold text-green-700">{stats?.total_clients ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <WalletIcon className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total comptes</p>
                    <p className="text-3xl font-bold text-blue-700">{stats?.total_comptes ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3Icon className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total épargne</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {Number(stats?.total_depots ?? 0).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUpIcon className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dépôts aujourd'hui</p>
                    <p className="text-2xl font-bold text-green-700">
                      +{Number(stats?.depots_aujourdhui ?? 0).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <TrendingDownIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Retraits aujourd'hui</p>
                    <p className="text-2xl font-bold text-red-600">
                      -{Number(stats?.retraits_aujourdhui ?? 0).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <WalletIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total retraits</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {Number(stats?.total_retraits ?? 0).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-gray-200 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUpIcon className="w-4 h-4 text-green-700" />
                  Derniers dépôts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.derniers_depots?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun dépôt.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="py-2 px-2">N° Transaction</th>
                        <th className="py-2 px-2">Montant</th>
                        <th className="py-2 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.derniers_depots?.map((depot) => (
                        <tr key={depot.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2 font-medium">{depot.numero_transaction}</td>
                          <td className="py-2 px-2 text-green-700 font-medium">+{Number(depot.montant).toLocaleString()} FCFA</td>
                          <td className="py-2 px-2">{depot.date_depot}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingDownIcon className="w-4 h-4 text-red-600" />
                  Derniers retraits
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.derniers_retraits?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun retrait.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="py-2 px-2">N° Transaction</th>
                        <th className="py-2 px-2">Montant</th>
                        <th className="py-2 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.derniers_retraits?.map((retrait) => (
                        <tr key={retrait.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2 font-medium">{retrait.numero_transaction}</td>
                          <td className="py-2 px-2 text-red-600 font-medium">-{Number(retrait.montant).toLocaleString()} FCFA</td>
                          <td className="py-2 px-2">{retrait.date_retrait}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}