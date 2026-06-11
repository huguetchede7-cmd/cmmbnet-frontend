import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, PlusIcon } from "lucide-react";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";

type Depot = {
  id: string;
  numero_transaction: string;
  client_id: string;
  compte_id: string;
  montant: number;
  date_depot: string;
  mode_paiement: string;
  status: string;
  client?: { last_name: string; first_name: string };
  compte?: { numero_compte: string };
};

export default function DepotsListesPages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [depots, setDepots] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDepots = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        { url: apiRoutes.admin.app.depots.list },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setDepots(response?.data?.list ?? response?.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepots();
  }, []);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WalletIcon className="w-6 h-6 text-green-700" />
          <h1 className="text-2xl font-bold tracking-tight">Dépôts</h1>
        </div>
        <Button
          onClick={() => navigate("/dashboard/epargne/depots/create")}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Nouveau dépôt
        </Button>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des dépôts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : depots.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun dépôt trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Transaction</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">N° Compte</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {depots.map((depot) => (
                    <tr key={depot.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{depot.numero_transaction}</td>
                      <td className="py-3 px-4">
                        {depot.client
                          ? `${depot.client.last_name} ${depot.client.first_name}`
                          : `Client #${depot.client_id}`}
                      </td>
                      <td className="py-3 px-4">
                        {depot.compte?.numero_compte ?? `Compte #${depot.compte_id}`}
                      </td>
                      <td className="py-3 px-4 font-medium text-green-700">
                        +{Number(depot.montant).toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4">{depot.date_depot}</td>
                      <td className="py-3 px-4">{depot.mode_paiement ?? '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          depot.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {depot.status === "success" ? "Validé" : "En attente"}
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