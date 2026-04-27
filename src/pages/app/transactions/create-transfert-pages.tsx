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
import { ArrowRightLeftIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import z from "zod/v3";

export default function CreateTransfertPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const transfertFields: FieldOption[] = [
    {
      tag: "compte_source",
      label: "Compte source",
      input_type: "text",
      size: "col-span-6",
      placeholder: "N° compte émetteur",
      required: true,
    },
    {
      tag: "compte_destination",
      label: "Compte destination",
      input_type: "text",
      size: "col-span-6",
      placeholder: "N° compte destinataire",
      required: true,
    },
    {
      tag: "montant",
      label: "Montant (FCFA)",
      input_type: "number",
      size: "col-span-6",
      placeholder: "0",
      required: true,
    },
    {
      tag: "date_transfert",
      label: "Date du transfert",
      input_type: "date",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "motif",
      label: "Motif",
      input_type: "text",
      size: "col-span-12",
      placeholder: "Motif du transfert",
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
    compte_source: z.string().min(1, "Le compte source est obligatoire"),
    compte_destination: z.string().min(1, "Le compte destination est obligatoire"),
    montant: z.number().min(1, "Le montant doit être supérieur à 0"),
    date_transfert: z.string().min(1, "La date est obligatoire"),
    motif: z.string().optional(),
    observation: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      compte_source: "",
      compte_destination: "",
      montant: 0,
      date_transfert: new Date().toISOString().split("T")[0],
      motif: "",
      observation: "",
    },
  });

  const handleOnCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingSubmit(true);
      console.log("Données transfert:", values);
      navigate(routeHelpers.dashboard.transactions.historique.index);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouveau transfert</h1>
        <p className="text-sm text-muted-foreground pt-1">
          Effectuer un transfert entre deux comptes.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOnCreate)} className="space-y-6">
          <Card className="border border-gray-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ArrowRightLeftIcon className="w-4 h-4 text-green-700" />
                Informations du transfert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-4">
                {transfertFields.map((option, index) => (
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
              onClick={() => navigate(routeHelpers.dashboard.transactions.historique.index)}
            >
              Annuler
            </Button>
            <ButtonWithLoading
              type="submit"
              classList="min-w-[140px] bg-green-700 hover:bg-green-800 text-white"
              title="Effectuer le transfert"
              loading={loadingSubmit}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}