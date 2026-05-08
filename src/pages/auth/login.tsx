
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormInputHelper } from '@/helpers/FormInputHelper.ts';
import ButtonWithLoading from '@/components/ui/button-with-loading';
import apiService from '@/api/apiService';
import apiRoutes from '@/api/apiRoutes';
import PageTitle from '@/components/seo/pageTitle';
import { cn } from "@/lib/utils.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label.tsx";
import type { UserModelTypes } from "@/types/UserModelTypes.ts"

const formSchema = z.object({
  email: z.string()
    .min(1, 'Email est requis')
    .email('Email invalide'),
  password: z.string()
    .min(1, 'Mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const postData = { email: values.email, password: values.password }
      const response = await apiService.post({ url: apiRoutes.admin.auth.login, body: postData }, null);
      await login(response?.data as UserModelTypes);
    } catch (error) {
      if (error instanceof Error) { apiService.handleError(error.message, { form }) }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle title="Connexion" />

      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <h2 className="text-primary font-bold leading-tight tracking-tighter text-2xl">
              MICROFINANCE
            </h2>
          </a>
          <div className={cn("flex flex-col gap-6")}>
            <Card className={"rounded"}>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Connectez vous</CardTitle>
                <CardDescription>
                  Connetez-vous à votre espace administrateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">Email</Label>
                        <FormControl>

                          <Input
                            className={`${FormInputHelper.getInputBorderClass(form, "email", field.value)} rounded`}
                            placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Mot de passe</Label>
                        <FormControl className="grid gap-3">

                          <Input
                            type="password"
                            className={`${FormInputHelper.getInputBorderClass(form, "password", field.value)} rounded`}
                            placeholder="Mot de passe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                    <ButtonWithLoading type="submit" classList="w-full text-white hover:bg-gray-800 cursor-pointer rounded" title='Se connecter'
                      loading={loading} />
                    <div className="text-center text-sm">

                      <a
                        href="#"
                        className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Vous avez oublié votre mot de passe ?{' '}
                      </a>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
