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
import { UsersIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import z from "zod/v3";

export default function CreateGroupePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const statusOptions = [
    { id: "active", name: "Actif" },
    { id: "inactive", name: "Inactif" },
  ];

  const groupeFields: FieldOption[] = [
    {
      tag: "nom",
      label: "Nom du groupe",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Ex: Groupe Solidaire Cotonou",
      required: true,
    },
    {
      tag: "responsable",
      label: "Responsable",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Nom du responsable",
      required: true,
    },
    {
      tag: "date_creation",
      label: "Date de création",
      input_type: "date",
      size: "col-span-6",
      required: true,
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
    {
      tag: "description",
      label: "Description",
      input_type: "textarea",
      size: "col-span-12",
      placeholder: "Description du groupe...",
      required: false,
    },
  ];

  const formSchema = z.object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    responsable: z.string().min(2, "Le responsable est obligatoire"),
    date_creation: z.string().min(1, "La date de création est obligatoire"),
    status: z.string().min(1, "Le statut est obligatoire"),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      responsable: "",
      date_creation: new Date().toISOString().split("T")[0],
      status: "active",
      description: "",
    },
  });

  const handleOnCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingSubmit(true);
      console.log("Données groupe:", values);
      navigate(routeHelpers.dashboard.groupes.index);
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
        <h1 className="text-2xl font-bold tracking-tight">Créer un groupe</h1>
        <p className="text-sm text-muted-foreground pt-1">
          Créer un nouveau groupe de clients.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOnCreate)} className="space-y-6">

          <Card className="border border-gray-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-green-700" />
                Informations du groupe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-4">
                {groupeFields.map((option, index) => (
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
              onClick={() => navigate(routeHelpers.dashboard.groupes.index)}
            >
              Annuler
            </Button>
            <ButtonWithLoading
              type="submit"
              classList="min-w-[140px] bg-green-700 hover:bg-green-800 text-white"
              title="Créer le groupe"
              loading={loadingSubmit}
            />
          </div>

        </form>
      </Form>
    </div>
  );
}