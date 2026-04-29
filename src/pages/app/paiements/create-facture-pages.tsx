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
import { FileTextIcon, UserIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import z from "zod/v3";

export default function CreateFacturePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const typeFactureOptions = [
    { id: "cotisation", name: "Cotisation" },
    { id: "frais_service", name: "Frais de service" },
    { id: "penalite", name: "Pénalité" },
    { id: "autre", name: "Autre" },
  ];

  const clientFields: FieldOption[] = [
    {
      tag: "numero_compte",
      label: "Numéro de compte client",
      input_type: "text",
      size: "col-span-12",
      placeholder: "Ex: MDB123456",
      required: true,
    },
  ];

  const factureFields: FieldOption[] = [
    {
      tag: "type_facture",
      label: "Type de facture",
      input_type: "select",
      placeholder: "Sélectionnez le type",
      options: typeFactureOptions.map((t) => ({
        value: t.id,
        label: t.name,
      })),
      size: "col-span-6",
      required: true,
    },
    {
      tag: "montant",
      label: "Montant (FCFA)",
      input_type: "number",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "date_emission",
      label: "Date d'émission",
      input_type: "date",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "date_echeance",
      label: "Date d'échéance",
      input_type: "date",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "description",
      label: "Description",
      input_type: "textarea",
      size: "col-span-12",
      placeholder: "Description de la facture...",
      required: false,
    },
  ];

  const formSchema = z.object({
    numero_compte: z.string().min(1, "Le numéro de compte est obligatoire"),
    type_facture: z.string().min(1, "Le type de facture est obligatoire"),
    montant: z.number().min(1, "Le montant doit être supérieur à 0"),
    date_emission: z.string().min(1, "La date d'émission est obligatoire"),
    date_echeance: z.string().min(1, "La date d'échéance est obligatoire"),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_compte: "",
      type_facture: "",
      montant: 0,
      date_emission: new Date().toISOString().split("T")[0],
      date_echeance: "",
      description: "",
    },
  });

  const handleOnCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingSubmit(true);
      console.log("Données facture:", values);
      navigate(routeHelpers.dashboard.paiements.factures.index);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouvelle facture</h1>
        <p className="text-sm text-muted-foreground pt-1">
          Créer une nouvelle facture pour un client.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOnCreate)} className="space-y-6">

          <Card className="border border-gray-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-green-700" />
                Identification du client
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

          <Card className="border border-gray-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileTextIcon className="w-4 h-4 text-green-700" />
                Informations de la facture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-4">
                {factureFields.map((option, index) => (
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
              onClick={() => navigate(routeHelpers.dashboard.paiements.factures.index)}
            >
              Annuler
            </Button>
            <ButtonWithLoading
              type="submit"
              classList="min-w-[140px] bg-green-700 hover:bg-green-800 text-white"
              title="Créer la facture"
              loading={loadingSubmit}
            />
          </div>

        </form>
      </Form>
    </div>
  );
}