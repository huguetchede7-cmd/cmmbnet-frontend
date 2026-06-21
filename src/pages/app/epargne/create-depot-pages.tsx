import { useAuth } from "@/lib/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form.tsx";
import { BindFormItem, type FieldOption } from "@/components/forms/bind-form-item.tsx";
import ButtonWithLoading from "@/components/ui/button-with-loading.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUpIcon, UserIcon, SearchIcon, CheckCircleIcon, CircleIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";
import { Input } from "@/components/ui/input";
import ReceiptModal from "@/components/ui/ReceiptModal";
import z from "zod/v3";

type Compte = {
  id: string;
  numero_compte: string;
  type_compte: string;
  solde: number;
  client_id: string;
  date_ouverture: string;
  date_echeance: string | null;
  montant_versement_mensuel: number | null;
  client: { last_name: string; first_name: string; member_number: string };
};

type Depot = {
  id: string;
  numero_versement: number | null;
  montant: number;
  date_depot: string;
};

type DepotResult = {
  numero_transaction: string;
  montant: number;
  mode_paiement: string;
  solde_apres: number;
};

type Versement = {
  numero: number;
  mois: string;
  montant: number;
  paye: boolean;
};

export default function CreateDepotPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [compte, setCompte] = useState<Compte | null>(null);
  const [searchNumero, setSearchNumero] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [versements, setVersements] = useState<Versement[]>([]);
  const [versementSelectionne, setVersementSelectionne] = useState<Versement | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<DepotResult | null>(null);

  const modePaiementOptions = [
    { id: "especes", name: "Espèces" },
    { id: "mobile_money", name: "Mobile Money" },
    { id: "virement", name: "Virement bancaire" },
    { id: "cheque", name: "Chèque" },
  ];

     const depotFields: FieldOption[] = [
    { tag: "montant", label: "Montant (FCFA)", input_type: "number", size: "col-span-6", required: true, disabled: compte?.type_compte === "epargne_terme" },
    { tag: "date_depot", label: "Date du dépôt", input_type: "date", size: "col-span-6", required: true },
    {
      tag: "mode_paiement",
      label: "Mode de paiement",
      input_type: "select",
      placeholder: "Sélectionnez le mode",
      options: modePaiementOptions.map((m) => ({ value: m.id, label: m.name })),
      size: "col-span-6",
      required: true,
    },
    { tag: "reference", label: "Référence (optionnel)", input_type: "text", size: "col-span-6", placeholder: "Référence de la transaction", required: false },
    { tag: "observation", label: "Observation", input_type: "textarea", size: "col-span-12", placeholder: "Remarques...", required: false },
  ];

  const formSchema = z.object({
    montant: z.number().min(1, "Le montant doit être supérieur à 0"),
    date_depot: z.string().min(1, "La date est obligatoire"),
    mode_paiement: z.string().min(1, "Le mode de paiement est obligatoire"),
    reference: z.string().optional(),
    observation: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montant: 0,
      date_depot: new Date().toISOString().split("T")[0],
      mode_paiement: "",
      reference: "",
      observation: "",
    },
  });

  // Générer la liste des versements attendus
  const genererVersements = (compte: Compte, depotsExistants: Depot[]) => {
    if (compte.type_compte !== "epargne_terme" || !compte.date_ouverture || !compte.date_echeance || !compte.montant_versement_mensuel) return;

    const dateOuverture = new Date(compte.date_ouverture);
    const dateEcheance = new Date(compte.date_echeance);
    const montant = Number(compte.montant_versement_mensuel);

    // Calculer le nombre de mois
    const nbMois = (dateEcheance.getFullYear() - dateOuverture.getFullYear()) * 12
      + (dateEcheance.getMonth() - dateOuverture.getMonth());

    const liste: Versement[] = [];
    for (let i = 1; i <= nbMois; i++) {
      const dateMois = new Date(dateOuverture);
      dateMois.setMonth(dateMois.getMonth() + i);

      const moisLabel = dateMois.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      const dejaPaye = depotsExistants.some((d) => d.numero_versement === i);

      liste.push({ numero: i, mois: moisLabel, montant, paye: dejaPaye });
    }

    setVersements(liste);
  };

  const loadCompte = async (compteId: string) => {
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.comptes.show}/${compteId}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      const compteData = response?.data ?? null;
      setCompte(compteData);

      if (compteData?.type_compte === "epargne_terme") {
        const depotsResponse = await apiService.get(
          { url: `${apiRoutes.admin.app.depots.byCompte}/${compteId}` },
          { userToken: user?.token ?? "", hasNoSuccessModal: true }
        );
        const depots = depotsResponse?.data ?? [];
        genererVersements(compteData, depots);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchCompte = async () => {
    if (!searchNumero.trim()) return;
    setSearchLoading(true);
    setSearchError("");
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.comptes.list}?numero_compte=${searchNumero.trim()}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      const found = response?.data ?? null;
      if (found && found.id) {
        setCompte(found);
        if (found.type_compte === "epargne_terme") {
          const depotsResponse = await apiService.get(
            { url: `${apiRoutes.admin.app.depots.byCompte}/${found.id}` },
            { userToken: user?.token ?? "", hasNoSuccessModal: true }
          );
          genererVersements(found, depotsResponse?.data ?? []);
        }
      } else {
        setSearchError("Aucun compte trouvé avec ce numéro.");
        setCompte(null);
      }
    } catch (error) {
      setSearchError("Aucun compte trouvé.");
      setCompte(null);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const compteId = searchParams.get("compte_id");
    if (compteId) loadCompte(compteId);
  }, []);

 const handleSelectVersement = (v: Versement) => {
  if (v.paye) return;
  setVersementSelectionne(v);
  form.setValue("montant", v.montant);
};

  const handleOnCreate = async (values: z.infer<typeof formSchema>) => {
    if (!compte) return;
    try {
      setLoadingSubmit(true);
      const response = await apiService.post(
        {
          url: apiRoutes.admin.app.depots.create,
          body: {
            compte_id: compte.id,
            client_id: compte.client_id,
            montant: values.montant,
            date_depot: values.date_depot,
            mode_paiement: values.mode_paiement,
            reference: values.reference || null,
            observation: values.observation || null,
            numero_versement: versementSelectionne?.numero ?? null,
          },
        },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );

      const depot = response?.data;
      setReceiptData({
        numero_transaction: depot?.numero_transaction ?? "",
        montant: values.montant,
        mode_paiement: values.mode_paiement,
        solde_apres: Number(compte.solde) + values.montant,
      });
      setShowReceipt(true);

    } catch (error) {
      if (error instanceof Error) {
        apiService.handleError(error.message, { form });
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouveau dépôt</h1>
        <p className="text-sm text-muted-foreground pt-1">Enregistrer un dépôt d'épargne.</p>
      </div>

      {!searchParams.get("compte_id") && (
        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <SearchIcon className="w-4 h-4 text-green-700" />
              Rechercher un compte membre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 items-center">
              <Input
                placeholder="Numéro de compte (ex: CPT-001)"
                value={searchNumero}
                onChange={(e) => setSearchNumero(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchCompte()}
                className="max-w-sm"
              />
              <Button type="button" onClick={searchCompte} disabled={searchLoading} className="bg-green-700 hover:bg-green-800 text-white">
                {searchLoading ? "Recherche..." : "Rechercher"}
              </Button>
            </div>
            {searchError && <p className="text-red-500 text-sm mt-2">{searchError}</p>}
          </CardContent>
        </Card>
      )}

      {compte && (
        <Card className="border border-green-200 bg-green-50 shadow-none">
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <UserIcon className="w-4 h-4 text-green-700" />
              <span className="font-medium text-green-800">{compte.client?.last_name} {compte.client?.first_name}</span>
              <span className="text-green-700">N° {compte.numero_compte}</span>
              <span className="text-green-700">Type : {compte.type_compte === "epargne_ordinaire" ? "Épargne ordinaire" : "Épargne à terme"}</span>
              <span className="font-bold text-green-800">Solde : {Number(compte.solde).toLocaleString('fr-FR')} FCFA</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des versements pour épargne à terme */}
      {compte && compte.type_compte === "epargne_terme" && versements.length > 0 && (
        <Card className="border border-blue-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4 text-blue-700" />
              Versements — Sélectionnez celui à payer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
              {versements.map((v) => (
                <div
                  key={v.numero}
                  onClick={() => handleSelectVersement(v)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    v.paye
                      ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                      : versementSelectionne?.numero === v.numero
                      ? "bg-blue-50 border-blue-500 cursor-pointer"
                      : "bg-white border-gray-200 hover:border-blue-300 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {v.paye ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <CircleIcon className={`w-5 h-5 ${versementSelectionne?.numero === v.numero ? "text-blue-500" : "text-gray-300"}`} />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        Versement {v.numero}/{versements.length} — {v.mois}
                      </p>
                      {v.paye && <p className="text-xs text-green-600">Déjà payé</p>}
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${v.paye ? "text-gray-400" : "text-blue-700"}`}>
                    {v.montant.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              ))}
            </div>
            {versementSelectionne && (
  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
    Versement <strong>{versementSelectionne.numero}/{versements.length}</strong> sélectionné —
    Montant fixé à <strong>{versementSelectionne.montant.toLocaleString('fr-FR')} FCFA</strong>
    <p className="text-xs text-orange-600 mt-1">
      ⚠️ Un dépôt = un seul versement. Pour payer plusieurs versements, effectuez plusieurs dépôts séparés.
    </p>
  </div>
)}
          </CardContent>
        </Card>
      )}

      {compte && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnCreate)} className="space-y-6">
            <Card className="border border-gray-200 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUpIcon className="w-4 h-4 text-green-700" />
                  Informations du dépôt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-4">
                  {depotFields.map((option, index) => (
                    <BindFormItem key={index} index={index} option={option}
                      // @ts-expect-error
                      form={form} tag={option.tag} readonly={false} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" className="min-w-[120px]" onClick={() => navigate(-1)}>
                Annuler
              </Button>
              <ButtonWithLoading
                type="submit"
                classList="min-w-[140px] bg-green-700 hover:bg-green-800 text-white"
                title="Enregistrer le dépôt"
                loading={loadingSubmit}
              />
            </div>
          </form>
        </Form>
      )}

      {showReceipt && receiptData && compte && (
        <ReceiptModal
          data={{
            type: "depot",
            nom: compte.client?.last_name ?? "",
            prenom: compte.client?.first_name ?? "",
            numero_compte: compte.numero_compte,
            date: new Date().toISOString(),
            numero_transaction: receiptData.numero_transaction,
            montant: receiptData.montant,
            mode_paiement: receiptData.mode_paiement,
            solde_apres: receiptData.solde_apres,
          }}
          onClose={() => {
            setShowReceipt(false);
            navigate(`/dashboard/comptes/detail/${compte.id}`);
          }}
        />
      )}
    </div>
  );
}