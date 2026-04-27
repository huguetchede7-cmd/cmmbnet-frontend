import apiRoutes from "@/api/apiRoutes.ts";
import apiService from "@/api/apiService.ts";
import { useAuth } from "@/lib/auth.ts";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form.tsx";
import ButtonWithLoading from "@/components/ui/button-with-loading.tsx";
import {
  BindFormItem,
  type FieldOption,
} from "@/components/forms/bind-form-item.tsx"
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, CreditCard, FileText } from "lucide-react";
import z from "zod/v3"
import { routeHelpers } from "@/helpers/routeHelpers.ts"

// Types
type AccountType = {
  id: string;
  name: string;
};

type IdDocumentType = {
  id: string;
  name: string;
};

export default function CreateClientPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);

  const genderOptions = [
    { id: "M", name: "Masculin" },
    { id: "F", name: "Féminin" },
  ];

  const statusOptions = [
    { id: "active", name: "Actif" },
    { id: "inactive", name: "Inactif" },
  ];

  const idDocumentOptions: IdDocumentType[] = [
    { id: "cni", name: "Carte Nationale d'Identité (CNI)" },
    { id: "passport", name: "Passeport" },
    { id: "permis", name: "Permis de conduire" },
    { id: "carte_consulaire", name: "Carte consulaire" },
    { id: "acte_naissance", name: "Acte de naissance" },
  ];

  const accountTypeOptions: AccountType[] = [
    { id: "epargne_ordinaire", name: "Épargne ordinaire" },
    { id: "epargne_terme", name: "Épargne à terme" },
    { id: "courant", name: "Compte courant" },
    { id: "joint", name: "Compte joint" },
  ];

  // Informations personnelles
  const personalInfoFields: FieldOption[] = [
    {
      tag: "last_name",
      label: "Nom",
      input_type: "text",
      size: "col-span-6",
      placeholder: "DUPONT",
      required: true,
    },
    {
      tag: "first_name",
      label: "Prénom",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Jean",
      required: true,
    },
    {
      tag: "birth_date",
      label: "Date de naissance",
      input_type: "date",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "gender",
      label: "Sexe",
      input_type: "select",
      placeholder: "Sélectionnez le sexe",
      options: genderOptions.map((g) => ({
        value: g.id,
        label: g.name,
      })),
      size: "col-span-6",
      required: true,
    },
  ];

  // Coordonnées
  const addressFields: FieldOption[] = [
    {
      tag: "address",
      label: "Adresse",
      input_type: "text",
      size: "col-span-12",
      placeholder: "Rue, numéro",
      required: true,
    },
    {
      tag: "neighborhood",
      label: "Quartier",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Quartier",
      required: true,
    },
    {
      tag: "district",
      label: "Arrondissement / Commune",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Arrondissement",
      required: true,
    },
    {
      tag: "city",
      label: "Ville",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Ville",
      required: true,
    },
    {
      tag: "primary_phone",
      label: "Téléphone principal",
      input_type: "phone",
      size: "col-span-6",
      placeholder: "+229 97 00 00 00",
      required: true,
    },
    {
      tag: "secondary_phone",
      label: "Téléphone secondaire",
      input_type: "phone",
      size: "col-span-6",
      placeholder: "+229 96 00 00 00",
      required: false,
    },
  ];

  // Informations d'adhésion
  const membershipFields: FieldOption[] = [
    {
      tag: "member_number",
      label: "Numéro de membre",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Généré automatiquement",
      required: false,
    },
    {
      tag: "join_date",
      label: "Date d'adhésion",
      input_type: "date",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "account_type",
      label: "Type de compte",
      input_type: "select",
      placeholder: "Sélectionnez un type de compte",
      options: accountTypeOptions.map((t) => ({
        value: t.id,
        label: t.name,
      })),
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
  ];

  // Pièce d'identité
  const identityFields: FieldOption[] = [
    {
      tag: "id_document_type",
      label: "Type de pièce",
      input_type: "select",
      placeholder: "Sélectionnez un type de pièce",
      options: idDocumentOptions.map((d) => ({
        value: d.id,
        label: d.name,
      })),
      size: "col-span-6",
      required: true,
    },
    {
      tag: "id_document_number",
      label: "Numéro de la pièce",
      input_type: "text",
      size: "col-span-6",
      placeholder: "Numéro de la pièce d'identité",
      required: true,
    },
  ];

  // Schéma de validation
  const formSchema = z.object({
    // Informations personnelles
    last_name: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères"),
    first_name: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    birth_date: z
      .string()
      .min(1, "La date de naissance est obligatoire"),
    gender: z
      .string()
      .min(1, "Le sexe est obligatoire"),

    // Coordonnées
    address: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères"),
    neighborhood: z
      .string()
      .min(2, "Le quartier est obligatoire"),
    district: z
      .string()
      .min(2, "L'arrondissement est obligatoire"),
    city: z
      .string()
      .min(2, "La ville est obligatoire"),
    primary_phone: z
      .string()
      .min(8, "Le numéro de téléphone est invalide"),
    secondary_phone: z
      .string()
      .optional(),

    // Informations d'adhésion
    member_number: z
      .string()
      .optional(),
    join_date: z
      .string()
      .min(1, "La date d'adhésion est obligatoire"),
    account_type: z
      .string()
      .min(1, "Le type de compte est obligatoire"),
    status: z
      .string()
      .min(1, "Le statut est obligatoire"),

    // Pièce d'identité
    id_document_type: z
      .string()
      .min(1, "Le type de pièce est obligatoire"),
    id_document_number: z
      .string()
      .min(5, "Le numéro de pièce doit contenir au moins 5 caractères"),
  });

  const FormEmpty = {
    last_name: "",
    first_name: "",
    birth_date: "",
    gender: "",
    address: "",
    neighborhood: "",
    district: "",
    city: "",
    primary_phone: "",
    secondary_phone: "",
    member_number: "",
    join_date: new Date().toISOString().split('T')[0], // Date du jour par défaut
    account_type: "",
    status: "active",
    id_document_type: "",
    id_document_number: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: FormEmpty,
  });

  const { reset } = form;

  const resetForm = () => {
    reset(FormEmpty);
  };

  const handleOnCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingSubmit(true);

      const payload = {
        // Informations personnelles
        last_name: values.last_name,
        first_name: values.first_name,
        birth_date: values.birth_date,
        gender: values.gender,
       
        // Coordonnées
        address: values.address,
        neighborhood: values.neighborhood,
        district: values.district,
        city: values.city,
        primary_phone: values.primary_phone,
        secondary_phone: values.secondary_phone || undefined,
       
        // Informations d'adhésion
        join_date: values.join_date,
        account_type: values.account_type,
        status: values.status,
       
        // Pièce d'identité
        id_document_type: values.id_document_type,
        id_document_number: values.id_document_number,
      };

      await apiService.post(
        {
          url: apiRoutes.admin.app.clients.create,
          body: payload,
        },
        { userToken: user?.token ?? "" }
      );

      resetForm();
      navigate(routeHelpers.dashboard.clients.index);
    } catch (error) {
      if (error instanceof Error) {
        apiService.handleError(error.message, { form });
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Charger les types de compte si nécessaire depuis l'API
      // const response = await apiService.get(...)
      // setAccountTypes(response.data)
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    fields: FieldOption[],
    sectionLoading: boolean
  ) => (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-900">
          <div className="p-1.5 bg-[var(--bluePetrol)]/10 rounded-md text-[var(--bluePetrol)]">
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-4">
          {sectionLoading
            ? Array.from({ length: fields.length }).map((_, i) => (
                <Skeleton key={i} className="h-10 col-span-6" />
              ))
            : fields.map((option, index) => (
                <BindFormItem
                  key={index}
                  index={index}
                  option={option}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  form={form}
                  tag={option.tag}
                  readonly={false}
                />
              ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">
                Nouveau client
              </h1>
              <p className="text-sm text-muted-foreground pt-1">
                Créer un nouveau dossier client avec toutes les informations requises.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Formulaire */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOnCreate)} className="space-y-6">
          {/* Section 1: Informations personnelles */}
          {renderSection(
            "Informations personnelles",
            <User className="w-4 h-4" />,
            personalInfoFields,
            loading
          )}

          {/* Section 2: Coordonnées */}
          {renderSection(
            "Coordonnées",
            <MapPin className="w-4 h-4" />,
            addressFields,
            loading
          )}

          {/* Section 3: Informations d'adhésion */}
          {renderSection(
            "Informations d'adhésion",
            <CreditCard className="w-4 h-4" />,
            membershipFields,
            loading
          )}

          {/* Section 4: Pièce d'identité */}
          {renderSection(
            "Pièce d'identité",
            <FileText className="w-4 h-4" />,
            identityFields,
            loading
          )}

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {loading ? (
              <>
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-[120px]"
                  onClick={() => {
                    resetForm();
                    navigate(routeHelpers.dashboard.clients.index);
                  }}
                >
                  Annuler
                </Button>
                <ButtonWithLoading
                 type="submit"
                 classList="min-w-[140px] bg-green-700 hover:bg-green-800 text-white"
                 title="Créer le client"
                 loading={loadingSubmit}
                  />
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
