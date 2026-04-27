import { useAuth } from "@/lib/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form.tsx";
import { BindFormItem, type FieldOption } from "@/components/forms/bind-form-item.tsx";
import ButtonWithLoading from "@/components/ui/button-with-loading.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, UserPlusIcon, TrashIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import z from "zod/v3";

type Membre = {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  numero_membre: string;
  date_adhesion: string;
};

export default function DetailGroupePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [membres, setMembres] = useState<Membre[]>([]);

  // Données fictives du groupe pour l'affichage
  const groupe = {
    nom: "Groupe Solidaire",
    responsable: "Jean Dupont",
    date_creation: "2026-01-01",
    status: "active",
    description: "Groupe d'épargne solidaire",
  };

  const membreFields: FieldOption[] = [
    {
      tag: "numero_membre",
      label: "Numéro de membre du client",
      input_type: "text",
      size: "col-span-12",
      placeholder: "Ex: MDB123456",
      required: true,
    },
  ];

  const formSchema = z.object({
    numero_membre: z.string().min(1, "Le numéro de membre est obligatoire"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { numero_membre: "" },
  });

  const handleAjouterMembre = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingSubmit(true);
      // API à connecter plus tard
      console.log("Ajouter membre:", values);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleRetirerMembre = (membreId: string) => {
    setMembres(membres.filter((m) => m.id !== membreId));
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{groupe.nom}</h1>
          <p className="text-sm text-muted-foreground pt-1">
            Responsable : {groupe.responsable} · Créé le {groupe.date_creation}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(routeHelpers.dashboard.groupes.index)}
        >
          Retour
        </Button>
      </div>

      {/* Ajouter un membre */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserPlusIcon className="w-4 h-4 text-green-700" />
            Ajouter un membre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAjouterMembre)} className="space-y-4">
              <div className="grid grid-cols-12 gap-4">
                {membreFields.map((option, index) => (
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
              <div className="flex justify-end">
                <ButtonWithLoading
                  type="submit"
                  classList="bg-green-700 hover:bg-green-800 text-white"
                  title="Ajouter au groupe"
                  loading={loadingSubmit}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Liste des membres */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-green-700" />
            Membres du groupe ({membres.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {membres.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun membre dans ce groupe.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Membre</th>
                    <th className="py-3 px-4">Nom</th>
                    <th className="py-3 px-4">Téléphone</th>
                    <th className="py-3 px-4">Date d'adhésion</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {membres.map((membre) => (
                    <tr key={membre.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{membre.numero_membre}</td>
                      <td className="py-3 px-4">{membre.nom} {membre.prenom}</td>
                      <td className="py-3 px-4">{membre.telephone}</td>
                      <td className="py-3 px-4">{membre.date_adhesion}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleRetirerMembre(membre.id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}