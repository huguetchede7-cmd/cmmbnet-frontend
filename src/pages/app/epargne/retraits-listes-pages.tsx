import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, WalletIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";

type Retrait = {
  id: string;
  numero_transaction: string;
  client_id: string;
  compte_id: string;
  montant: number;
  date_retrait: string;
  mode_paiement: string;
  status: string;
  client?: { last_name: string; first_name: string };
  compte?: { numero_compte: string };
};

export default function RetraitsListesPages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [retraits, setRetraits] = useState<Retrait[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRetraits = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        { url: apiRoutes.admin.app.retraits.list },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setRetraits(response?.data?.list ?? response?.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetraits();
  }, []);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WalletIcon className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold tracking-tight">Retraits</h1>
        </div>
        <Button
          onClick={() => navigate(routeHelpers.dashboard.epargne.retraits.create)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Nouveau retrait
        </Button>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des retraits</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : retraits.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun retrait trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Transaction</th>
                    <th className="py-3 px-4">Membre</th>
                    <th className="py-3 px-4">N° Compte</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {retraits.map((retrait) => (
                    <tr key={retrait.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{retrait.numero_transaction}</td>
                      <td className="py-3 px-4">
                        {retrait.client
                          ? `${retrait.client.last_name} ${retrait.client.first_name}`
                          : `Client #${retrait.client_id}`}
                      </td>
                      <td className="py-3 px-4">
                        {retrait.compte?.numero_compte ?? `Compte #${retrait.compte_id}`}
                      </td>
                      <td className="py-3 px-4 font-medium text-red-600">
                        -{Number(retrait.montant).toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4">{retrait.date_retrait}</td>
                      <td className="py-3 px-4">{retrait.mode_paiement ?? '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          retrait.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {retrait.status === "success" ? "Validé" : "En attente"}
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