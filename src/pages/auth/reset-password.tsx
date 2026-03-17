import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { genralConfig } from '../../../config';
import apiService from "@/api/apiService.ts"
import { FormInputHelper } from "@/helpers/FormInputHelper.ts"
import apiRoutes from "@/api/apiRoutes.ts"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { ShieldCheck } from "lucide-react"
import PageTitle from "@/components/seo/pageTitle.tsx"
import ButtonWithLoading from "@/components/ui/button-with-loading.tsx"


const formSchema = z.object({
  newPassword: z.string()
    .min(1, 'Mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirm_password: z.string()
    .min(1, 'Mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
}).refine((data) => data.newPassword === data.confirm_password, {
    message: "Les mots de passe doivent correspondre",
    path: ["confirm_password"],
  });

export function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirm_password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        setLoading(true);
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");
        const postData = {new_password: values.newPassword, token: token} 
        await apiService.post({url: apiRoutes.admin.utils.resetPassword+`?token=${token}`, body: postData}, null);
        setIsPasswordUpdate(true)
    } catch (error) {
        if(error instanceof Error) {apiService.handleError(error.message, {form}) }
    } finally {
        setLoading(false)
    }
  }

  return (
    <>
      <PageTitle title="Nouveau mot de passe" />
      <div>
        {/* Logo Section */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <img id="logoIcon" alt="logo" src={genralConfig?.iconUrl || "/fallback-icon.png"} />
        </div>

        {/* Main Content */}
        <div className="md:border md:rounded-md">
          {!isPasswordUpdate ? (
            // Forgot Password Form
            <div>
              <div className="space-y-2 px-5">
                <div>
                  <h1 className="text-2xl mt-4 mb-4 font-semibold tracking-tight">Réinitialisation de mot de passe</h1>
                </div>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-5">
                  <p className="text-sm mb-0 text-muted-foreground">
                    Nouveau mot de passe (6 caractères minimum)
                  </p>
                  <FormField 
                    control={form.control} 
                    name="newPassword" 
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type='password'
                            className={`${FormInputHelper.getInputBorderClass(form, "newPassword", field.value)}`}
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   <p className="text-sm mb-0 text-muted-foreground">
                    Confirmer le mot de passe
                  </p>
                  <FormField 
                    control={form.control} 
                    name="confirm_password" 
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type='password'
                            className={`${FormInputHelper.getInputBorderClass(form, "confirm_password", field.value)}`}
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ButtonWithLoading type="submit" classList="w-full" title="Mettre à jour" loading={loading} />
                </form>
              </Form>
            </div>
          ) : (
            // Email Sent Confirmation
            <div className='space-y-2 px-5'>
              <ShieldCheck className="mx-auto h-12 w-12 text-green-500 mt-6" />
              <h1 className="text-2xl font-semibold tracking-tight text-center mt-5">Mot de passe changé</h1>
              <p className="text-sm text-muted-foreground text-center">
                Votre mot de passe a été mise à jour avec succès
              </p>
            </div>
          )}

          {/* Footer Section */}
          <div className="text-center text-sm bg-gray-100 p-3 mt-7">
            Retour à la
            <Link
              to="/login"
              className="text-muted-foreground text-primary pl-1 hover:underline hover:text-primary"
            >
              page de connexion
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}