"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";
import { useAuth } from "@/lib/auth";
import { TinyAvatar } from '@/components/useful/AdvancedAvatar.tsx';
import { genralConfig } from '../../../../config.ts';
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from '@/components/ui/form.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from "@/components/ui/button.tsx";
import ButtonWithLoading from "@/components/ui/button-with-loading.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  BindFormItem,
  type FieldOption,
} from "@/components/forms/bind-form-item.tsx"
import { UtilsHelpers } from '@/helpers/UtilsHelpers.ts'
import { Lock, Unlock } from 'lucide-react'
import ActionModal from '@/components/useful/action-modal.tsx'
import { LucideIcon } from '@/components/useful/LucideIcon.tsx'
import type { RolesAdminType } from "@/types/UtilsTypes.ts"

export type UserProfile = {
  id: number;
  avatar: string;
  created_at: string;
  firstname: string;
  lastname: string | null;
  email: string;
  phone: string | null;
  ban_statut: boolean;
  client_ref: string;
  email_verified_at: string | null;
};


export default function DetailAdministratorPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [user_, setUser_] = useState<UserProfile|null>(null);
  const [roles, setRoles] = useState<RolesAdminType[]>([]);
  const [roleIds, setRoleIds] = useState<number[]>([]);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

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
    },
    {
      tag: "password",
      label: "Mot de passe",
      input_type: "password",
      size: "col-span-6",
      required: true,
    },
  ];

  const formSchema = z.object({
    firstname: z.string().min(2, "Le prénom est requis (min 2 caractères)"),
    lastname: z.string().min(2, "Le nom est requis (min 2 caractères)"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  /* =======================
     FETCH ROLES
  ======================= */
  const fetchAllRoles = async () => {
    try {
      const response = await apiService.get(
        { url: apiRoutes.admin.app.roles.list },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setRoles(response.data);
    } catch (error) {
      apiService.handleError((error as Error).message, { form });
    }
  };

  /* =======================
     FETCH USER INFO
  ======================= */
  const fetchUser = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.administrator.show}/${id}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );

      const u = response.data.user;
      setUser_(u);

      // Pré-remplir le formulaire
      form.reset({
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
      });

      // Pré-cocher les rôles
      const assignedRoles = response.data.permissions?.map((r: any) => r.role_id) || [];
      setRoleIds(assignedRoles);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur", error);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
   BLOCK USER
======================= */
  const handleBlockUser = async () => {
    if (!user_) return;

    try {
      await apiService.put(
        { url: `${apiRoutes.admin.app.administrator.block}/${id}` },
        { userToken: user?.token ?? "" }
      );

      setIsOpenConfirm(false);
      fetchUser();
    } catch (error) {
      apiService.handleError((error as Error).message);
    }
  };

  /* =======================
     UNBLOCK USER
  ======================= */
  const handleUnblockUser = async () => {
    if (!user_) return;

    try {
      await apiService.put(
        { url: `${apiRoutes.admin.app.administrator.unblock}/${id}` },
        { userToken: user?.token ?? "" }
      );

      setIsOpenConfirm(false);
      fetchUser();
    } catch (error) {
      apiService.handleError((error as Error).message);
    }
  };


  useEffect(() => {
    fetchAllRoles();
    fetchUser();
  }, [id]);

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
     SUBMIT UPDATE
  ======================= */
  const handleUpdate = async (values: z.infer<typeof formSchema>) => {
    if (roleIds.length === 0) {
      setRoleError("Sélectionnez au moins un rôle");
      return;
    }

    try {
      setLoadingSubmit(true);
      await apiService.put(
        {
          url: `${apiRoutes.admin.app.administrator.update}/${id}`,
          body: {
            ...values,
            role_ids: roleIds,
          },
        },
        { userToken: user?.token ?? "" }
      );

      navigate("/dashboard/administrator");
    } catch (error) {
      apiService.handleError((error as Error).message, { form });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!id) {
    return (
      <div className="p-8 text-center text-red-500">
        ID utilisateur manquant dans l’URL.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Avatar + Infos */}
      <div className="flex flex-col items-center justify-center space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </>
        ) : (
          <>
            <TinyAvatar
              name={`${user_?.firstname || ""} ${user_?.lastname || ""}`}
              image={
                user_?.avatar &&
                !user_.avatar.includes("default_profil.jpg") &&
                user_.avatar !== genralConfig.imageStoragePrefix
                  ? user_.avatar
                  : null
              }
              size="5xl"
              showTooltip
              className="cursor-pointer"
            />
            <div className="space-y-1 text-center">
              <h1 className="text-xl font-bold">{`${user_?.firstname || ""} ${user_?.lastname || ""}`}</h1>
              <p className="text-sm text-gray-500">{user_?.email || ""}</p>
              <p className="text-sm text-gray-500">
                {UtilsHelpers.formatPhoneNumber(user_?.phone || "")}
              </p>
              <div className="text-sm text-gray-500">
                {user_?.email_verified_at && user_?.ban_statut ? (
                  <span className="px-1 py-0.5 text-xs text-red-600 bg-red-100 rounded">Bloqué</span>
                ) : user_?.email_verified_at && !user_?.ban_statut ? (
                  <span className="px-1 py-0.5 text-xs text-green-600 bg-green-100 rounded">Actif</span>
                ) : (
                  <span className="px-1 py-0.5 text-xs text-yellow-600 bg-yellow-100 rounded">Non vérifiés</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-end">
        {user_ && (
          <Button
            variant={user_.ban_statut ? "default" : "destructive"}
            onClick={() => setIsOpenConfirm(true)}
            className={
              user_.ban_statut
                ? "bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                : "flex items-center gap-2"
            }
          >
            {user_.ban_statut ? (
              <>
                <Unlock className="w-4 h-4" />
                Débloquer
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Bloquer
              </>
            )}
          </Button>
        )}
      </div>


      {/* FORMULAIRE */}
      <div className="bg-white p-6 rounded">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)}>

            <div className="grid grid-cols-12 gap-4">
              {loading
                ? Array.from({ length: formItems.length }).map((_, i) => (
                  <Skeleton key={i} className="h-10 col-span-6" />
                ))
                : formItems.map((option, index) => (
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
            </div>

            {/* ROLES */}
            <div className="mt-10 border-t">
              <div className="space-y-1 mb-2">
                <h3 className="text-lg font-semibold">Rôles</h3>
                <p className="text-xs text-muted-foreground">
                  Les rôles définissent les permissions et l’accès aux fonctionnalités
                </p>
              </div>
              <div className=" grid
                              grid-cols-1
                              sm:grid-cols-2
                              lg:grid-cols-3
                              xl:grid-cols-4
                              gap-3">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3
                      has-[[aria-checked=true]]:border-blue-600
                      has-[[aria-checked=true]]:bg-blue-50
                      dark:has-[[aria-checked=true]]:border-blue-900
                      dark:has-[[aria-checked=true]]:bg-blue-950"
                  >
                    <Checkbox
                      checked={roleIds.includes(role.id)}
                      onCheckedChange={(checked) => toggleRole(role.id, Boolean(checked))}
                      className="data-[state=checked]:border-blue-600
                        data-[state=checked]:bg-blue-600
                        data-[state=checked]:text-white"
                    />
                    <div className="grid gap-1">
                      <p className="flex item-center gap-1 text-sm font-medium"><LucideIcon name={role.icon} size={16}/>{role.title}</p>
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
            <div className="flex justify-end gap-2 mt-6">
              <ButtonWithLoading
                type="submit"
                title="Mettre à jour"
                classList={""}
                loading={loadingSubmit}
              />
            </div>
          </form>
        </Form>
      </div>

      {/* CONFIRM MODAL */}
      <ActionModal
        title={
          user_?.ban_statut
            ? "Êtes-vous sûr de vouloir débloquer cet utilisateur ?"
            : "Êtes-vous sûr de vouloir bloquer cet utilisateur ?"
        }
        description={
          user_?.ban_statut
            ? "L'utilisateur pourra à nouveau accéder à la plateforme."
            : "L'utilisateur ne pourra plus accéder à la plateforme."
        }
        isOpen={isOpenConfirm}
        isetIsOpen={setIsOpenConfirm}
        onConfirm={
          user_?.ban_statut ? handleUnblockUser : handleBlockUser
        }
        onCancel={() => setIsOpenConfirm(false)}
        confirmText={user_?.ban_statut ? "Débloquer" : "Bloquer"}
        confirmColor={user_?.ban_statut ?"green" : "red"}
      />
    </div>
  );
}
