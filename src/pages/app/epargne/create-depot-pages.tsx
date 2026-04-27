import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form.tsx";
import { BindFormItem, type FieldOption } from "@/components/forms/bind-form-item.tsx";
import ButtonWithLoading from "@/components/ui/button-with-loading.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, UserIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import z from "zod/v3";

export default function CreateDepotPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const modePaiementOptions = [
    { id: "especes", name: "Espèces" },
    { id: "mobile_money", name: "Mobile Money" },
    { id: "virement", name: "Virement bancaire" },
    { id: "cheque", name: "Chèque" },
  ];

  const clientFields: FieldOption[] = [
    {
      tag: "numero_compte",
      label: "Numéro de compte",
      input_type: "text",
      size: "col-span-12",
      placeholder: "Ex: MDB123456",
      required: true,
    },
  ];

  const depotFields: FieldOption[] = [
    {
      tag: "montant",
      label: "Montant (FCFA)",
      input_type: "number",
      size: "col-span-6",
      placeholder: "0",
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
      options: modePaiementOptions.map((m) => ({
        value: m.id,
        label: m.name,
      })),
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
      placeholder: "Remarques ou observations...",
      required: false,
    },
  ];

  const formSchema = z.object({
    numero_compte: z.string().min(1, "Le numéro de compte est obligatoire"),
    montant: z.number().min(1, "Le montant doit être supérieur à 0"),
    date_depot: z.string().min(1, "La date est obligatoire"),
    mode_paiement: z.string().min(1, "Le mode de paiement est obligatoire"),
    reference: z.string().optional(),
    observation: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_compte: "",
      montant: 0,
      date_depot: new Date().toISOString().split("T")[0],
      mode_paiement: "",
      reference: "",
      observation: "",
    },
  });

  const handleOnCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingSubmit(true);
      console.log("Données dépôt:", values);
      navigate(routeHelpers.dashboard.epargne.depots.index);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouveau dépôt</h1>
        <p className="text-sm text-muted-foreground pt-1">
          Enregistrer un nouveau dépôt d'épargne.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOnCreate)} className="space-y-6">

          {/* Section compte */}
          <Card className="border border-gray-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-green-700" />
                Identification du compte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-4">
                {clientFields.map((option, index) => (
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

          {/* Section dépôt */}
          <Card className="border border-gray-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <WalletIcon className="w-4 h-4 text-green-700" />
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

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="min-w-[120px]"
              onClick={() => navigate(routeHelpers.dashboard.epargne.depots.index)}
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