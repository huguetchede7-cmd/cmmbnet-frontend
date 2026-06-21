import { useAuth } from "@/lib/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, ArrowLeftIcon, TrendingUpIcon, TrendingDownIcon, LockIcon } from "lucide-react";
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
  date_echeance: string | null;
  taux_interet: number | null;
  montant_versement_mensuel: number | null;
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
  numero_versement: number | null;
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
  const [showCloture, setShowCloture] = useState(false);
  const [cloturing, setCloturing] = useState(false);

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

  // Calcul clôture
  const estEcheanceAtteinte = () => {
    if (!compte?.date_echeance) return false;
    return new Date() >= new Date(compte.date_echeance);
  };

  const getNbMois = () => {
    if (!compte?.date_ouverture || !compte?.date_echeance) return 0;
    const debut = new Date(compte.date_ouverture);
    const fin = new Date(compte.date_echeance);
    return (fin.getFullYear() - debut.getFullYear()) * 12 + (fin.getMonth() - debut.getMonth());
  };

  const getNbVersementsPaies = () => {
    return depots.filter((d) => d.numero_versement !== null).length;
  };

  const tousVersementsPaies = () => {
    return getNbVersementsPaies() >= getNbMois();
  };

  const capital = compte?.montant_versement_mensuel
    ? Number(compte.montant_versement_mensuel) * getNbMois()
    : 0;

  const interets = capital && compte?.taux_interet
    ? (capital * Number(compte.taux_interet)) / 100
    : 0;

  const montantTotal = capital + interets;

  const peutCloturer =
    compte?.type_compte === "epargne_terme" &&
    compte?.status === "active" &&
    estEcheanceAtteinte() &&
    tousVersementsPaies();

  const handleCloturer = async () => {
    if (!compte) return;
    setCloturing(true);
    try {
      // Créer un retrait du montant total
      await apiService.post(
        {
          url: apiRoutes.admin.app.retraits.create,
          body: {
            compte_id: compte.id,
            client_id: compte.client.id,
            montant: montantTotal,
            date_retrait: new Date().toISOString().split("T")[0],
            mode_paiement: "especes",
            motif: "Clôture épargne à terme — Capital + Intérêts",
          },
        },
        { userToken: user?.token ?? "" }
      );

      // Mettre à jour le statut du compte
      await apiService.put(
        {
          url: `${apiRoutes.admin.app.comptes.show}/${compte.id}`,
          body: { status: "cloture" },
        },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );

      setShowCloture(false);
      fetchCompte();
      fetchRetraits();
    } catch (error) {
      console.error(error);
    } finally {
      setCloturing(false);
    }
  };

  if (loading) return <p className="p-6 text-sm text-muted-foreground">Chargement...</p>;
  if (!compte) return <p className="p-6 text-sm text-muted-foreground">Compte introuvable.</p>;

  const statusColor = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    bloque: "bg-red-100 text-red-700",
    cloture: "bg-blue-100 text-blue-700",
  }[compte.status] ?? "bg-gray-100 text-gray-600";

  const statusLabel = {
    active: "Actif",
    inactive: "Inactif",
    bloque: "Bloqué",
    cloture: "Clôturé",
  }[compte.status] ?? compte.status;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{compte.numero_compte}</h1>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        {compte.status === "active" && (
          <div className="flex gap-2">
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={() => navigate(`${routeHelpers.dashboard.epargne.depots.create}?compte_id=${compte.id}&client_id=${compte.client?.id}`)}
            >
              <TrendingUpIcon className="w-4 h-4 mr-2" />
              Dépôt
            </Button>
            {compte.type_compte !== "epargne_terme" && (
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => navigate(`${routeHelpers.dashboard.epargne.retraits.create}?compte_id=${compte.id}&client_id=${compte.client?.id}`)}
              >
                <TrendingDownIcon className="w-4 h-4 mr-2" />
                Retrait
              </Button>
            )}
            {peutCloturer && (
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white"
                onClick={() => setShowCloture(true)}
              >
                <LockIcon className="w-4 h-4 mr-2" />
                Clôturer le compte
              </Button>
            )}
          </div>
        )}
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
            <p><span className="font-medium text-gray-700">Type :</span> {compte.type_compte === "epargne_ordinaire" ? "Épargne ordinaire" : "Épargne à terme"}</p>
            <p><span className="font-medium text-gray-700">Solde actuel :</span> <span className="text-green-700 font-bold">{Number(compte.solde).toLocaleString('fr-FR')} FCFA</span></p>
            <p><span className="font-medium text-gray-700">Solde initial :</span> {Number(compte.solde_initial).toLocaleString('fr-FR')} FCFA</p>
            <p><span className="font-medium text-gray-700">Date d'ouverture :</span> {compte.date_ouverture}</p>
            {compte.type_compte === "epargne_terme" && (
              <>
                <p><span className="font-medium text-gray-700">Date d'échéance :</span> {compte.date_echeance ?? "—"}</p>
                <p><span className="font-medium text-gray-700">Taux d'intérêt :</span> {compte.taux_interet ?? 0}%</p>
                <p><span className="font-medium text-gray-700">Versement mensuel :</span> {Number(compte.montant_versement_mensuel ?? 0).toLocaleString('fr-FR')} FCFA</p>
                <p><span className="font-medium text-gray-700">Versements effectués :</span> {getNbVersementsPaies()} / {getNbMois()}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Titulaire du compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="font-medium text-gray-700">Nom :</span> {compte.client?.last_name} {compte.client?.first_name}</p>
            <p><span className="font-medium text-gray-700">N° Membre :</span> {compte.client?.member_number}</p>
            <p><span className="font-medium text-gray-700">Téléphone :</span> {compte.client?.primary_phone}</p>
          </CardContent>
        </Card>
      </div>

      {/* Récapitulatif épargne à terme */}
      {compte.type_compte === "epargne_terme" && (
        <Card className={`border shadow-none ${peutCloturer ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Récapitulatif épargne à terme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">Capital total</p>
                <p className="font-bold text-gray-800 text-lg">{capital.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">Intérêts ({compte.taux_interet ?? 0}%)</p>
                <p className="font-bold text-blue-600 text-lg">{interets.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">Montant à rembourser</p>
                <p className="font-bold text-green-700 text-lg">{montantTotal.toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>
            {!estEcheanceAtteinte() && (
              <p className="mt-3 text-sm text-orange-600">
                ⏳ Échéance non atteinte — remboursement possible à partir du {new Date(compte.date_echeance!).toLocaleDateString('fr-FR')}
              </p>
            )}
            {estEcheanceAtteinte() && !tousVersementsPaies() && (
              <p className="mt-3 text-sm text-red-600">
                ⚠️ {getNbMois() - getNbVersementsPaies()} versement(s) non effectué(s) — clôture impossible
              </p>
            )}
            {peutCloturer && (
              <p className="mt-3 text-sm text-blue-700 font-medium">
                ✅ Tous les versements sont effectués et l'échéance est atteinte — vous pouvez clôturer le compte
              </p>
            )}
          </CardContent>
        </Card>
      )}

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
                    {compte.type_compte === "epargne_terme" && <th className="py-3 px-4">Versement</th>}
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
                      {compte.type_compte === "epargne_terme" && (
                        <td className="py-3 px-4">
                          {depot.numero_versement
                            ? <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Versement {depot.numero_versement}/{getNbMois()}</span>
                            : "—"}
                        </td>
                      )}
                      <td className="py-3 px-4 font-medium text-green-700">+{Number(depot.montant).toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-3 px-4">{depot.date_depot}</td>
                      <td className="py-3 px-4">{depot.mode_paiement || "—"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Validé</span>
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
                      <td className="py-3 px-4 font-medium text-red-600">-{Number(retrait.montant).toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-3 px-4">{retrait.date_retrait}</td>
                      <td className="py-3 px-4">{retrait.mode_paiement || "—"}</td>
                      <td className="py-3 px-4">{retrait.motif || "—"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Validé</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal clôture */}
      {showCloture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-bold mb-2">Clôturer le compte</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Vous êtes sur le point de clôturer le compte <span className="font-semibold text-black">{compte.numero_compte}</span> de <span className="font-semibold text-black">{compte.client?.last_name} {compte.client?.first_name}</span>.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Capital total</span>
                <span className="font-bold">{capital.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Intérêts ({compte.taux_interet}%)</span>
                <span className="font-bold text-blue-600">+{interets.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                <span className="font-semibold">Montant à rembourser</span>
                <span className="font-bold text-green-700 text-base">{montantTotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <p className="text-xs text-orange-600 mb-4">
              ⚠️ Cette action est irréversible. Le compte sera clôturé et le montant sera remboursé au membre.
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCloture(false)} disabled={cloturing}>
                Annuler
              </Button>
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white"
                onClick={handleCloturer}
                disabled={cloturing}
              >
                {cloturing ? "Clôture en cours..." : "Confirmer la clôture"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}