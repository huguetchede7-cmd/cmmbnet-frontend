import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form.tsx";
import { BindFormItem, type FieldOption } from "@/components/forms/bind-form-item.tsx";
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

export default function CreateComptePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [clientTrouve, setClientTrouve] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
const [searchParams] = useSearchParams();

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

  const typeCompteOptions = [
    { id: "epargne_ordinaire", name: "Épargne ordinaire" },
    { id: "epargne_terme", name: "Épargne à terme" },
    { id: "courant", name: "Compte courant" },
    { id: "joint", name: "Compte joint" },
  ];

  const statusOptions = [
    { id: "active", name: "Actif" },
    { id: "inactive", name: "Inactif" },
  ];

  const compteFields: FieldOption[] = [
    {
      tag: "type_compte",
      label: "Type de compte",
      input_type: "select",
      placeholder: "Sélectionnez un type de compte",
      options: typeCompteOptions.map((t) => ({
        value: t.id,
        label: t.name,
      })),
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
      options: statusOptions.map((s) => ({
        value: s.id,
        label: s.name,
      })),
      size: "col-span-6",
      required: true,
    },
  ];

  const formSchema = z.object({
    client_id: z.string().min(1, "Le client est obligatoire"),
    type_compte: z.string().min(1, "Le type de compte est obligatoire"),
    date_ouverture: z.string().min(1, "La date d'ouverture est obligatoire"),
    solde_initial: z.number().optional(),
    status: z.string().min(1, "Le statut est obligatoire"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      type_compte: "",
      date_ouverture: new Date().toISOString().split("T")[0],
      solde_initial: 0,
      status: "active",
    },
  });

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
    try {
      setLoadingSubmit(true);
      await apiService.post(
        {
          url: apiRoutes.admin.app.comptes.create,
          body: {
            client_id: values.client_id,
            type_compte: values.type_compte,
            date_ouverture: values.date_ouverture,
            solde_initial: values.solde_initial || 0,
            status: values.status,
          },
        },
        { userToken: user?.token ?? "" }
      );
      navigate(routeHelpers.dashboard.comptes.index);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ouvrir un compte</h1>
        <p className="text-sm text-muted-foreground pt-1">
          Recherchez un client puis ouvrez un compte pour lui.
        </p>
      </div>

      {/* Recherche client */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-green-700" />
            Rechercher le client
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
            <Button
              type="button"
              onClick={handleSearch}
              variant="outline"
              disabled={loadingSearch}
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              {loadingSearch ? "Recherche..." : "Rechercher"}
            </Button>
          </div>

          {/* Résultats de recherche */}
          {clients.length > 0 && (
            <div className="border rounded-md divide-y">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  onClick={() => handleSelectClient(client)}
                >
                  <div>
                    <p className="font-medium">{client.last_name} {client.first_name}</p>
                    <p className="text-sm text-muted-foreground">N° {client.member_number} · {client.city}</p>
                  </div>
                  <Button variant="outline" size="sm">Sélectionner</Button>
                </div>
              ))}
            </div>
          )}

          {/* Client sélectionné */}
          {clientTrouve && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">{clientTrouve.last_name} {clientTrouve.first_name}</p>
                <p className="text-sm text-green-700">N° {clientTrouve.member_number} · {clientTrouve.primary_phone}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setClientTrouve(null);
                  form.setValue("client_id", "");
                }}
              >
                Changer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulaire compte — visible seulement si client sélectionné */}
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
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                className="min-w-[120px]"
                onClick={() => navigate(routeHelpers.dashboard.comptes.index)}
              >
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