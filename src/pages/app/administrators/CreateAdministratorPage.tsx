import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";
import { useAuth } from "@/lib/auth.ts";
import { useEffect, useState } from "react";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form.tsx";
import ButtonWithLoading from "@/components/ui/button-with-loading.tsx"
import {
  BindFormItem,
  type FieldOption,
} from "@/components/forms/bind-form-item.tsx"
import { useNavigate } from "react-router-dom";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideIcon } from '@/components/useful/LucideIcon.tsx'

import { Input } from "@/components/ui/input"; // If not already used, for manual password field input
import { Eye, EyeOff } from "lucide-react";
import type { RolesAdminType } from "@/types/UtilsTypes.ts"

// Simple helper to generate a secure random password
function generatePassword(length = 16) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?/[]{}|";
  let password = "";
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
}

export default function CreateAdministratorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [roles, setRoles] = useState<RolesAdminType[]>([]);
  const [roleIds, setRoleIds] = useState<number[]>([]);
  const [roleError, setRoleError] = useState<string | null>(null);

  // ==== STATE POUR LA VISIBILITE DU MOT DE PASSE (optionel)
  const [passwordVisible, setPasswordVisible] = useState(false);

  /* =======================
     FORM FIELDS (will ignore password for custom handling)
  ======================= */
  const formItems: FieldOption[] = [
    {
      tag: "lastname",
      label: "Nom",
      input_type: "text",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "firstname",
      label: "Prénom",
      input_type: "text",
      size: "col-span-6",
      required: true,
    },
    {
      tag: "email",
      label: "Email",
      input_type: "email",
      size: "col-span-6",
      required: true,
    }
    // password field will be rendered custom below
  ];

  /* =======================
     ZOD SCHEMA -- password obligatoire
  ======================= */
  const formSchema = z.object({
    firstname: z.string().min(2, "Le prénom est requis (min 2 caractères)"),
    lastname: z.string().min(2, "Le nom est requis (min 2 caractères)"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .nonempty("Le mot de passe est requis"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    }
  });

  /* =======================
     FETCH ROLES
  ======================= */
  const fetchAllRoles = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        { url: apiRoutes.admin.app.roles.list },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setRoles(response.data);
    } catch (error) {
      apiService.handleError((error as Error).message, { form });
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     TOGGLE ROLE
  ======================= */
  const toggleRole = (roleId: number, checked: boolean) => {
    setRoleError(null);
    setRoleIds((prev) =>
      checked ? [...prev, roleId] : prev.filter((id) => id !== roleId)
    );
  };

  /* =======================
     CREATE USER
  ======================= */
  const handleCreate = async (values: z.infer<typeof formSchema>) => {
    // Obligatoire de choisir au moins une permission
    if (roleIds.length === 0) {
      setRoleError("Sélectionnez au moins une permission");
      return;
    }

    try {
      setLoadingSubmit(true);

      await apiService.post(
        {
          url: apiRoutes.admin.app.administrator.create,
          body: {
            ...values,
            role_ids: roleIds,
          },
        },
        { userToken: user?.token ?? "" }
      );

      navigate(routeHelpers.dashboard.administrator.index);
    } catch (error) {
      apiService.handleError((error as Error).message, { form });
    } finally {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    fetchAllRoles();
  }, []);

  // Handler pour générer le mot de passe
  const handleGeneratePassword = () => {
    const password = generatePassword();
    form.setValue("password", password, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Créer un administrateur</h1>
        <p className="text-sm text-muted-foreground">
          Remplissez le formulaire pour ajouter un administrateur
        </p>
      </div>

      <div className="bg-white p-6 rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreate)}>
            {/* FORM INPUTS */}
            <div className={" mb-3"}>
              <h3 className="text font-semibold">Information</h3>
              <span className={"text-sm text-gray-400"}>Choisisez les action à faire par cet utilisateur</span>
            </div>
            <div className="lg:grid lg:grid-cols-12 gap-4">
              {loading
                ? Array.from({ length: formItems.length + 1 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 col-span-6" />
                ))
                : (
                  <>
                    {formItems.map((option, index) => (
                      <BindFormItem
                        key={index}
                        index={index}
                        option={option}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        form={form}
                        tag={option.tag}
                      />
                    ))}
                    {/* Mot de passe avec bouton pour genérer */}
                    <div className="col-span-6 flex flex-col gap-1">
                      <label className="block mb-1 font-medium text-sm" htmlFor="password">
                        Mot de passe <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 items-center">
                        <Controller
                          name="password"
                          control={form.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="password"
                              type={passwordVisible ? "text" : "password"}
                              placeholder="Saisir ou générer un mot de passe"
                              autoComplete="new-password"
                            />
                          )}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          className="btn-exclude border-1 border-gray-300 bg-gray-50"
                          onClick={handleGeneratePassword}
                        >
                          Générer
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="btn-exclude border-1 border-gray-300 bg-gray-50"
                          onClick={() => setPasswordVisible((v) => !v)}
                          tabIndex={-1}
                          title={passwordVisible ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                        >
                          {passwordVisible
                            ? (
                              <Eye size={16} />
                            )
                            : (
                              <EyeOff size={16} />
                            )
                          }
                        </Button>
                      </div>
                      {/* Afficher l'erreur si mot de passe invalide */}
                      {form.formState.errors.password && (
                        <span className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</span>
                      )}
                    </div>
                  </>
                )
              }
            </div>

            {/* ROLES */}
            <div className="mt-8">
              <div className={" mb-3"}>
                <h3 className="text font-semibold">Permissions</h3>
                <span className={"text-sm text-gray-400"}>Choisisez les action à faire par cet utilisateur</span>
              </div>

              <div className=" grid
                              grid-cols-1
                              sm:grid-cols-2
                              lg:grid-cols-3
                              xl:grid-cols-3
                              gap-3">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3
                      has-[[aria-checked=true]]:border-blue-600
                      has-[[aria-checked=true]]:bg-blue-50
                      dark:has-[[aria-checked=true]]:border-blue-900
                      dark:has-[[aria-checked=true]]:bg-blue-950 
                      cursor-pointer hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={roleIds.includes(role.id)}
                      onCheckedChange={(checked) => toggleRole(role.id, Boolean(checked))}
                      className="btn-exclude bg-gray-50 data-[state=checked]:border-blue-600
                        data-[state=checked]:bg-blue-600
                        data-[state=checked]:text-white"
                    />
                    <div className="grid gap-1">
                      <p className="flex item-center gap-1 text-sm font-medium"><LucideIcon name={role.icon} size={16} />{role.title}</p>
                      {role.description && (
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {!roleIds.length && roleError && (
                <div className="mt-2">
                  <p className={"text-red-500"}>{roleError}</p>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-8">
              <Button
                type="button"
                variant="outline"
                className="btn-exclude border-1 border-gray-300 bg-gray-50"
                onClick={() => navigate(routeHelpers.dashboard.administrator.index)}
              >
                Annuler
              </Button>

              <ButtonWithLoading
                type="submit"
                title="Enregistrer"
                loading={loadingSubmit}
                classList=""
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
