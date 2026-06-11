import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";
import { useAuth } from "@/lib/auth.ts";
import { Button } from "@/components/ui/button.tsx";
import ButtonWithLoading from "@/components/ui/button-with-loading.tsx";
import { BindFormItem } from "@/components/forms/bind-form-item.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form.tsx";
import { ArrowLeftIcon } from "lucide-react";

const editClientSchema = z.object({
  last_name: z.string().min(2, "Le nom est requis"),
  first_name: z.string().min(2, "Le prénom est requis"),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  neighborhood: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  primary_phone: z.string().min(8, "Le téléphone est requis"),
  secondary_phone: z.string().optional(),
  status: z.string().optional(),
  profession: z.string().optional(),
});

type EditClientForm = z.infer<typeof editClientSchema>;

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<EditClientForm>({
    resolver: zodResolver(editClientSchema),
    defaultValues: {
      last_name: "",
      first_name: "",
      birth_date: "",
      gender: "",
      neighborhood: "",
      district: "",
      city: "Cotonou",
      primary_phone: "",
      secondary_phone: "",
      status: "active",
      profession: "",
    }
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await apiService.get(
          { url: `${apiRoutes.admin.app.clients.show}/${id}` },
          { userToken: user?.token ?? "", hasNoSuccessModal: true }
        );
        const client = response.data;
        form.reset({
          last_name: client.last_name ?? "",
          first_name: client.first_name ?? "",
          birth_date: client.birth_date ?? "",
          gender: client.gender ?? "",
          neighborhood: client.neighborhood ?? "",
          district: client.district ?? "",
          city: client.city ?? "Cotonou",
          primary_phone: client.primary_phone ?? "",
          secondary_phone: client.secondary_phone ?? "",
          status: client.status ?? "active",
          profession: client.profession ?? "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClient();
  }, [id]);

  const onSubmit = async (data: EditClientForm) => {
    setSaving(true);
    try {
      await apiService.put(
        {
          url: `${apiRoutes.admin.app.clients.update}/${id}`,
          body: data,
        },
        { userToken: user?.token ?? "" }
      );
      navigate(`/dashboard/clients/detail/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        apiService.handleError(error.message, { form });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-sm text-muted-foreground">Chargement...</p>;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/clients/detail/${id}`)}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Modifier le membre</h1>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BindFormItem
                option={{ tag: "last_name", label: "Nom", required: true }}
                // @ts-expect-error
                form={form}
                tag="last_name"
              />
              <BindFormItem
                option={{ tag: "first_name", label: "Prénom", required: true }}
                // @ts-expect-error
                form={form}
                tag="first_name"
              />
              <BindFormItem
                option={{ tag: "birth_date", label: "Date de naissance", input_type: "date" }}
                // @ts-expect-error
                form={form}
                tag="birth_date"
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Sexe</label>
                <select {...form.register("gender")} className="w-full p-2 border rounded text-sm">
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <BindFormItem
                option={{ tag: "primary_phone", label: "Téléphone principal", required: true }}
                // @ts-expect-error
                form={form}
                tag="primary_phone"
              />
              <BindFormItem
                option={{ tag: "secondary_phone", label: "Téléphone secondaire" }}
                // @ts-expect-error
                form={form}
                tag="secondary_phone"
              />
              <BindFormItem
                option={{ tag: "neighborhood", label: "Quartier" , input_type: "text", required: true}}
                // @ts-expect-error
                form={form}
                tag="neighborhood"
              />
              <BindFormItem
                option={{ tag: "district", label: "Arrondissement", input_type: "text", required: true }}
                // @ts-expect-error
                form={form}
                tag="district"
              />
              <BindFormItem
                option={{ tag: "city", label: "Ville" , input_type: "text", required: true}}
                // @ts-expect-error
                form={form}
                tag="city"
              />
              <BindFormItem
                option={{ tag: "profession", label: "Profession", input_type: "text", required: true }}
                // @ts-expect-error
                form={form}
                tag="profession"
              />

              <div className="flex flex-col gap-1">
  <label className="text-sm font-medium">Statut</label>
  <select {...form.register("status")} className="w-full p-2 border rounded text-sm">
    <option value="active">Actif</option>
    <option value="inactive">Inactif</option>
  </select>
</div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" variant="outline" onClick={() => navigate(`/dashboard/clients/detail/${id}`)}>
                Annuler
              </Button>
              <ButtonWithLoading
                type="submit"
                title="Enregistrer les modifications"
                loading={saving}
                classList="bg-green-700 hover:bg-green-800 text-white"
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}