import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form.tsx";
import { BindFormItem } from "@/components/forms/bind-form-item.tsx";
import ButtonWithLoading from "@/components/ui/button-with-loading.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WalletIcon, UserIcon, SearchIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";
import z from "zod/v3";

type Client = {
  id: string;
  last_name: string;
  first_name: string;
  member_number: string;
  primary_phone: string;
  city: string;
  status: string;
};

const DUREES_TERME = [
  { label: "3 mois", mois: 3, taux: 3.0 },
  { label: "6 mois", mois: 6, taux: 4.5 },
  { label: "9 mois", mois: 9, taux: 5.5 },
  { label: "12 mois", mois: 12, taux: 6.5 },
  { label: "1 an", mois: 12, taux: 6.5 },
  { label: "2 ans", mois: 24, taux: 8.0 },
  { label: "3 ans", mois: 36, taux: 9.5 },
  { label: "4 ans", mois: 48, taux: 11.0 },
  { label: "5 ans", mois: 60, taux: 12.5 },
];

export default function CreateComptePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [clientTrouve, setClientTrouve] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [dureeSelectionnee, setDureeSelectionnee] = useState<typeof DUREES_TERME[0] | null>(null);
  const [showRecu, setShowRecu] = useState(false);
  const [compteCreee, setCompteCreee] = useState<any>(null);
  const [searchParams] = useSearchParams();

  const formSchema = z.object({
    client_id: z.string().min(1, "Le client est obligatoire"),
    type_compte: z.string().min(1, "Le type de compte est obligatoire"),
    date_ouverture: z.string().min(1, "La date d'ouverture est obligatoire"),
    date_echeance: z.string().optional(),
    taux_interet: z.number().optional(),
    montant_versement_mensuel: z.number().optional(),
    solde_initial: z.number().optional(),
    status: z.string().min(1, "Le statut est obligatoire"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      type_compte: "",
      date_ouverture: new Date().toISOString().split("T")[0],
      date_echeance: "",
      taux_interet: 0,
      montant_versement_mensuel: 0,
      solde_initial: 0,
      status: "active",
    },
  });

  const versementMensuel = form.watch("montant_versement_mensuel") || 0;
  const montantFinal = dureeSelectionnee
    ? versementMensuel * dureeSelectionnee.mois +
      (versementMensuel * dureeSelectionnee.mois * dureeSelectionnee.taux) / 100
    : 0;

  const typeCompteSelectionne = useWatch({ control: form.control, name: "type_compte" });
  const dateOuverture = useWatch({ control: form.control, name: "date_ouverture" });

  const loadClientById = async (id: string) => {
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.clients.show}/${id}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      if (response?.data) {
        setClientTrouve(response.data);
        form.setValue("client_id", String(response.data.id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const clientId = searchParams.get("client_id");
    if (clientId && clientId !== "null") {
      loadClientById(clientId);
    }
  }, []);

  const handleSelectDuree = (duree: typeof DUREES_TERME[0]) => {
    setDureeSelectionnee(duree);
    form.setValue("taux_interet", duree.taux);
    const base = dateOuverture ? new Date(dateOuverture) : new Date();
    const echeance = new Date(base);
    echeance.setMonth(echeance.getMonth() + duree.mois);
    form.setValue("date_echeance", echeance.toISOString().split("T")[0]);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoadingSearch(true);
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.clients.list}?search=${search}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setClients(response?.data?.list ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectClient = (client: Client) => {
    setClientTrouve(client);
    setClients([]);
    setSearch("");
    form.setValue("client_id", client.id);
  };

  const handleOnCreate = async (values: z.infer<typeof formSchema>) => {
    if (values.type_compte === "epargne_terme" && !values.date_echeance) {
      form.setError("date_echeance", {
        type: "manual",
        message: "Veuillez sélectionner une durée pour le compte à terme",
      });
      return;
    }
    try {
      setLoadingSubmit(true);
      const response = await apiService.post(
        {
          url: apiRoutes.admin.app.comptes.create,
          body: {
            client_id: values.client_id,
            type_compte: values.type_compte,
            date_ouverture: values.date_ouverture,
            date_echeance: values.date_echeance || null,
            taux_interet: values.taux_interet || null,
            montant_versement_mensuel: values.montant_versement_mensuel || null,
            solde_initial: values.solde_initial || 0,
            status: values.status,
          },
        },
        { userToken: user?.token ?? "" }
      );
      setCompteCreee(response?.data ?? null);
      setShowRecu(true);
    } catch (error) {
      if (error instanceof Error) console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const typeCompteOptions = [
    { id: "epargne_ordinaire", name: "Épargne ordinaire" },
    { id: "epargne_terme", name: "Épargne à terme" },
  ];

  const statusOptions = [
    { id: "active", name: "Actif" },
    { id: "inactive", name: "Inactif" },
  ];

  const compteFields = [
    {
      tag: "type_compte",
      label: "Type de compte",
      input_type: "select",
      placeholder: "Sélectionnez un type de compte",
      options: typeCompteOptions.map((t) => ({ value: t.id, label: t.name })),
      size: "col-span-6",
      required: true,
    },
    {
      tag: "date_ouverture",
      label: "Date d'ouverture",
      input_type: "date",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "solde_initial",
      label: "Solde initial (FCFA)",
      input_type: "number",
      size: "col-span-6",
      placeholder: "0",
      required: false,
    },
    {
      tag: "status",
      label: "Statut",
      input_type: "select",
      placeholder: "Sélectionnez le statut",
      options: statusOptions.map((s) => ({ value: s.id, label: s.name })),
      size: "col-span-6",
      required: true,
    },
  ];

  if (showRecu && compteCreee && clientTrouve) {
    return (
      <div className="space-y-6 max-w-[800px] mx-auto p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-700">✅ Compte ouvert avec succès !</h1>
          <div className="flex gap-2">
            <Button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white">
              🖨️ Imprimer le reçu
            </Button>
            <Button variant="outline" onClick={() => navigate(routeHelpers.dashboard.comptes.index)}>
              Fermer
            </Button>
          </div>
        </div>
        <div id="recu-compte" className="border-2 border-green-700 rounded-lg p-8 bg-white print:shadow-none">
          <div className="text-center border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-bold text-green-700">CAISSE DU MOUVEMENT MUTUALISTE BÉNINOIS</h2>
            <p className="text-sm text-gray-500">Gbégamey, Rue 11.036, Cotonou, Bénin</p>
            <p className="text-sm text-gray-500">Plateforme Cmmbnet</p>
            <div className="mt-3 inline-block bg-green-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
              REÇU D'OUVERTURE DE COMPTE
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informations du membre</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Nom complet :</span><span className="ml-2 font-semibold">{clientTrouve.last_name} {clientTrouve.first_name}</span></div>
              <div><span className="text-gray-500">N° Membre :</span><span className="ml-2 font-semibold">{clientTrouve.member_number}</span></div>
              <div><span className="text-gray-500">Téléphone :</span><span className="ml-2 font-semibold">{clientTrouve.primary_phone}</span></div>
              <div><span className="text-gray-500">Ville :</span><span className="ml-2 font-semibold">{clientTrouve.city}</span></div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informations du compte</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">N° Compte :</span><span className="ml-2 font-semibold text-green-700">{compteCreee.numero_compte}</span></div>
              <div><span className="text-gray-500">Type :</span><span className="ml-2 font-semibold">{compteCreee.type_compte === "epargne_ordinaire" ? "Épargne ordinaire" : "Épargne à terme"}</span></div>
              <div><span className="text-gray-500">Solde initial :</span><span className="ml-2 font-semibold text-green-700">{Number(compteCreee.solde_initial || 0).toLocaleString()} FCFA</span></div>
              <div><span className="text-gray-500">Date d'ouverture :</span><span className="ml-2 font-semibold">{compteCreee.date_ouverture}</span></div>
              <div><span className="text-gray-500">Statut :</span><span className="ml-2 font-semibold text-green-700">Actif</span></div>
              {compteCreee.date_echeance && (
                <div><span className="text-gray-500">Date d'échéance :</span><span className="ml-2 font-semibold">{compteCreee.date_echeance}</span></div>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4 text-center text-xs text-gray-400">
            <p>Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
            <p className="mt-1">Ce reçu atteste de l'ouverture du compte auprès de la CMMB</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ouvrir un compte</h1>
        <p className="text-sm text-muted-foreground pt-1">Recherchez un membre puis ouvrez un compte pour lui.</p>
      </div>

      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-green-700" />
            Rechercher le membre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Nom, prénom ou numéro de membre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-lg"
            />
            <Button type="button" onClick={handleSearch} variant="outline" disabled={loadingSearch}>
              <SearchIcon className="w-4 h-4 mr-2" />
              {loadingSearch ? "Recherche..." : "Rechercher"}
            </Button>
          </div>

          {clients.length > 0 && (
            <div className="border rounded-md divide-y">
              {clients.map((client) => (
                <div key={client.id} className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between" onClick={() => handleSelectClient(client)}>
                  <div>
                    <p className="font-medium">{client.last_name} {client.first_name}</p>
                    <p className="text-sm text-muted-foreground">N° {client.member_number} · {client.city}</p>
                  </div>
                  <Button variant="outline" size="sm">Sélectionner</Button>
                </div>
              ))}
            </div>
          )}

          {clientTrouve && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">{clientTrouve.last_name} {clientTrouve.first_name}</p>
                <p className="text-sm text-green-700">N° {clientTrouve.member_number} · {clientTrouve.primary_phone}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setClientTrouve(null); form.setValue("client_id", ""); }}>
                Changer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {clientTrouve && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnCreate)} className="space-y-6">
            <Card className="border border-gray-200 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <WalletIcon className="w-4 h-4 text-green-700" />
                  Informations du compte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-4">
                  {compteFields.map((option, index) => (
                    <BindFormItem
                      key={index}
                      index={index}
                      option={option}
                      // @ts-expect-error
                      form={form}
                      tag={option.tag}
                      readonly={false}
                    />
                  ))}
                </div>

                {typeCompteSelectionne === "epargne_terme" && (
                  <div className="mt-6 space-y-4">
                    <p className="text-sm font-semibold text-gray-700">Durée et taux d'intérêt</p>

                    <div className="flex flex-wrap gap-2">
                      {DUREES_TERME.map((duree) => (
                        <button
                          key={duree.label}
                          type="button"
                          onClick={() => handleSelectDuree(duree)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                            dureeSelectionnee?.label === duree.label
                              ? "bg-green-700 text-white border-green-700"
                              : "bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:text-green-700"
                          }`}
                        >
                          {duree.label}
                        </button>
                      ))}
                    </div>

                    {dureeSelectionnee && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Durée</p>
                          <p className="font-semibold text-green-800">{dureeSelectionnee.label}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Taux d'intérêt</p>
                          <p className="font-semibold text-green-800">{dureeSelectionnee.taux}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date d'échéance</p>
                          <p className="font-semibold text-green-800">
                            {form.watch("date_echeance")
                              ? new Date(form.watch("date_echeance")!).toLocaleDateString('fr-FR')
                              : "—"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-12 gap-4">
                      <BindFormItem
                        index={98}
                        option={{
                          tag: "montant_versement_mensuel",
                          label: "Versement mensuel obligatoire (FCFA)",
                          input_type: "number",
                          size: "col-span-6",
                          placeholder: "Ex: 10000",
                          required: false,
                        }}
                        // @ts-expect-error
                        form={form}
                        tag="montant_versement_mensuel"
                        readonly={false}
                      />
                      <BindFormItem
                        index={99}
                        option={{
                          tag: "taux_interet",
                          label: "Taux d'intérêt (%)",
                          input_type: "number",
                          size: "col-span-6",
                          placeholder: "Ex: 6.5",
                          required: false,
                        }}
                        // @ts-expect-error
                        form={form}
                        tag="taux_interet"
                        readonly={false}
                      />
                    </div>

                    {dureeSelectionnee && versementMensuel > 0 && (
                      <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800 mb-3">
                          Récapitulatif à l'échéance
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Capital total</p>
                            <p className="font-bold text-gray-800">
                              {(versementMensuel * dureeSelectionnee.mois).toLocaleString('fr-FR')} FCFA
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Intérêts ({dureeSelectionnee.taux}%)</p>
                            <p className="font-bold text-blue-600">
                              {((versementMensuel * dureeSelectionnee.mois * dureeSelectionnee.taux) / 100).toLocaleString('fr-FR')} FCFA
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Montant à recevoir</p>
                            <p className="font-bold text-green-700 text-lg">
                              {montantFinal.toLocaleString('fr-FR')} FCFA
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" className="min-w-[120px]" onClick={() => navigate(routeHelpers.dashboard.comptes.index)}>
                Annuler
              </Button>
              <ButtonWithLoading
                type="submit"
                classList="min-w-[140px] bg-green-700 hover:bg-green-800 text-white"
                title="Ouvrir le compte"
                loading={loadingSubmit}
              />
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}