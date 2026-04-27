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

export default function CreateComptePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

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

  const clientFields: FieldOption[] = [
    {
      tag: "client_id",
      label: "Numéro de membre du client",
      input_type: "text",
      size: "col-span-12",
      placeholder: "Ex: MDB123456",
      required: true,
    },
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
    client_id: z.string().min(1, "Le numéro de membre est obligatoire"),
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

  const handleOnCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingSubmit(true);
      // API à connecter plus tard
      console.log("Données compte:", values);
      navigate(routeHelpers.dashboard.comptes.index);
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
        <h1 className="text-2xl font-bold tracking-tight">Ouvrir un compte</h1>
        <p className="text-sm text-muted-foreground pt-1">
          Ouvrir un nouveau compte pour un client existant.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOnCreate)} className="space-y-6">

          {/* Section client */}
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

          {/* Section compte */}
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

          {/* Boutons */}
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
    </div>
  );
}