import { useAuth } from "@/lib/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, ArrowLeftIcon, TrendingUpIcon, TrendingDownIcon, PlusIcon } from "lucide-react";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";
import { routeHelpers } from "@/helpers/routeHelpers.ts";

type Compte = {
  id: string;
  numero_compte: string;
  type_compte: string;
  solde: number;
  solde_initial: number;
  status: string;
  date_ouverture: string;
  client: {
    id: string;
    last_name: string;
    first_name: string;
    member_number: string;
    primary_phone: string;
  };
};

type Depot = {
  id: string;
  numero_transaction: string;
  montant: number;
  date_depot: string;
  mode_paiement: string;
  status: string;
};

type Retrait = {
  id: string;
  numero_transaction: string;
  montant: number;
  date_retrait: string;
  mode_paiement: string;
  motif: string;
  status: string;
};

export default function DetailComptePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [compte, setCompte] = useState<Compte | null>(null);
  const [depots, setDepots] = useState<Depot[]>([]);
  const [retraits, setRetraits] = useState<Retrait[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompte = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.comptes.show}/${id}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setCompte(response?.data ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepots = async () => {
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.depots.byCompte}/${id}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setDepots(response?.data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRetraits = async () => {
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.retraits.byCompte}/${id}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setRetraits(response?.data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompte();
    fetchDepots();
    fetchRetraits();
  }, [id]);

  if (loading) return <p className="p-6 text-sm text-muted-foreground">Chargement...</p>;
  if (!compte) return <p className="p-6 text-sm text-muted-foreground">Compte introuvable.</p>;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{compte.numero_compte}</h1>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            compte.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {compte.status === "active" ? "Actif" : "Inactif"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-green-700 hover:bg-green-800 text-white"
            onClick={() => navigate(`${routeHelpers.dashboard.epargne.depots.create}?compte_id=${compte.id}&client_id=${compte.client?.id}`)}
          >
            <TrendingUpIcon className="w-4 h-4 mr-2" />
            Dépôt
          </Button>
          <Button
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => navigate(`${routeHelpers.dashboard.epargne.retraits.create}?compte_id=${compte.id}&client_id=${compte.client?.id}`)}
          >
            <TrendingDownIcon className="w-4 h-4 mr-2" />
            Retrait
          </Button>
        </div>
      </div>

      {/* Infos du compte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <WalletIcon className="w-4 h-4 text-green-700" />
              Informations du compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="font-medium text-gray-700">N° Compte :</span> {compte.numero_compte}</p>
            <p><span className="font-medium text-gray-700">Type :</span> {compte.type_compte}</p>
            <p><span className="font-medium text-gray-700">Solde actuel :</span> <span className="text-green-700 font-bold">{Number(compte.solde).toLocaleString()} FCFA</span></p>
            <p><span className="font-medium text-gray-700">Solde initial :</span> {Number(compte.solde_initial).toLocaleString()} FCFA</p>
            <p><span className="font-medium text-gray-700">Date d'ouverture :</span> {compte.date_ouverture}</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              Titulaire du compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="font-medium text-gray-700">Nom :</span> {compte.client?.last_name} {compte.client?.first_name}</p>
            <p><span className="font-medium text-gray-700">N° Membre :</span> {compte.client?.member_number}</p>
            <p><span className="font-medium text-gray-700">Téléphone :</span> {compte.client?.primary_phone}</p>
          </CardContent>
        </Card>
      </div>

      {/* Dépôts */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4 text-green-700" />
            Dépôts ({depots.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {depots.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun dépôt effectué.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Transaction</th>
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
                      <td className="py-3 px-4 font-medium text-green-700">+{Number(depot.montant).toLocaleString()} FCFA</td>
                      <td className="py-3 px-4">{depot.date_depot}</td>
                      <td className="py-3 px-4">{depot.mode_paiement || "-"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Validé
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

      {/* Retraits */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingDownIcon className="w-4 h-4 text-red-600" />
            Retraits ({retraits.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {retraits.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun retrait effectué.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Transaction</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Motif</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {retraits.map((retrait) => (
                    <tr key={retrait.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{retrait.numero_transaction}</td>
                      <td className="py-3 px-4 font-medium text-red-600">-{Number(retrait.montant).toLocaleString()} FCFA</td>
                      <td className="py-3 px-4">{retrait.date_retrait}</td>
                      <td className="py-3 px-4">{retrait.mode_paiement || "-"}</td>
                      <td className="py-3 px-4">{retrait.motif || "-"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Validé
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