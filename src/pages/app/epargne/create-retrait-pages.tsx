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
import { TrendingDownIcon, UserIcon } from "lucide-react";
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

export default function CreateRetraitPage() {
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

  const retraitFields: FieldOption[] = [
    {
      tag: "montant",
      label: "Montant (FCFA)",
      input_type: "number",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "date_retrait",
      label: "Date du retrait",
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
      tag: "motif",
      label: "Motif du retrait",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Ex: Besoin urgent",
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
    date_retrait: z.string().min(1, "La date est obligatoire"),
    mode_paiement: z.string().min(1, "Le mode de paiement est obligatoire"),
    motif: z.string().optional(),
    observation: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montant: 0,
      date_retrait: new Date().toISOString().split("T")[0],
      mode_paiement: "",
      motif: "",
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
          url: apiRoutes.admin.app.retraits.create,
          body: {
            compte_id: compteId,
            client_id: clientId,
            montant: values.montant,
            date_retrait: values.date_retrait,
            mode_paiement: values.mode_paiement,
            motif: values.motif || null,
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
        <h1 className="text-2xl font-bold tracking-tight">Nouveau retrait</h1>
        <p className="text-sm text-muted-foreground pt-1">
          Enregistrer un retrait d'épargne.
        </p>
      </div>

      {/* Infos compte */}
      {compte && (
        <Card className="border border-red-200 bg-red-50 shadow-none">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4 text-sm">
              <UserIcon className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-800">
                {compte.client?.last_name} {compte.client?.first_name}
              </span>
              <span className="text-red-700">N° {compte.numero_compte}</span>
              <span className="text-red-700">Type : {compte.type_compte}</span>
              <span className="font-bold text-red-800">
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
                <TrendingDownIcon className="w-4 h-4 text-red-600" />
                Informations du retrait
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-4">
                {retraitFields.map((option, index) => (
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
              classList="min-w-[140px] bg-red-600 hover:bg-red-700 text-white"
              title="Enregistrer le retrait"
              loading={loadingSubmit}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}