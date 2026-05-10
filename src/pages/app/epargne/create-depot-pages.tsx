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
import { TrendingUpIcon, UserIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";
import z from "zod/v3";

type Compte = {
  id: string;
  numero_compte: string;
  type_compte: string;
  solde: number;
  client: { last_name: string; first_name: string; member_number: string };
};

export default function CreateDepotPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [compte, setCompte] = useState<Compte | null>(null);

  const modePaiementOptions = [
    { id: "especes", name: "Espèces" },
    { id: "mobile_money", name: "Mobile Money" },
    { id: "virement", name: "Virement bancaire" },
    { id: "cheque", name: "Chèque" },
  ];

  const depotFields: FieldOption[] = [
    {
      tag: "montant",
      label: "Montant (FCFA)",
      input_type: "number",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "date_depot",
      label: "Date du dépôt",
      input_type: "date",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "mode_paiement",
      label: "Mode de paiement",
      input_type: "select",
      placeholder: "Sélectionnez le mode",
      options: modePaiementOptions.map((m) => ({ value: m.id, label: m.name })),
      size: "col-span-6",
      required: true,
    },
    {
      tag: "reference",
      label: "Référence (optionnel)",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Référence de la transaction",
      required: false,
    },
    {
      tag: "observation",
      label: "Observation",
      input_type: "textarea",
      size: "col-span-12",
      placeholder: "Remarques...",
      required: false,
    },
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

  const loadCompte = async (compteId: string) => {
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.comptes.show}/${compteId}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setCompte(response?.data ?? null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const compteId = searchParams.get("compte_id");
    if (compteId) loadCompte(compteId);
  }, []);

  const handleOnCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingSubmit(true);
      const compteId = searchParams.get("compte_id");
      const clientId = searchParams.get("client_id");
      await apiService.post(
        {
          url: apiRoutes.admin.app.depots.create,
          body: {
            compte_id: compteId,
            client_id: clientId,
            montant: values.montant,
            date_depot: values.date_depot,
            mode_paiement: values.mode_paiement,
            reference: values.reference || null,
            observation: values.observation || null,
          },
        },
        { userToken: user?.token ?? "" }
      );
      navigate(`/dashboard/comptes/detail/${compteId}`);
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
        <p className="text-sm text-muted-foreground pt-1">
          Enregistrer un dépôt d'épargne.
        </p>
      </div>

      {/* Infos compte */}
      {compte && (
        <Card className="border border-green-200 bg-green-50 shadow-none">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4 text-sm">
              <UserIcon className="w-4 h-4 text-green-700" />
              <span className="font-medium text-green-800">
                {compte.client?.last_name} {compte.client?.first_name}
              </span>
              <span className="text-green-700">N° {compte.numero_compte}</span>
              <span className="text-green-700">Type : {compte.type_compte}</span>
              <span className="font-bold text-green-800">
                Solde : {Number(compte.solde).toLocaleString()} FCFA
              </span>
            </div>
          </CardContent>
        </Card>
      )}

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
              onClick={() => navigate(-1)}
            >
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
    </div>
  );
}