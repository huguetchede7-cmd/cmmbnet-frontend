import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {  Link } from 'react-router-dom';
import { genralConfig } from '../../../config';
import { FormInputHelper } from '../../helpers/FormInputHelper';
import ButtonWithLoading from '@/components/ui/button-with-loading';
import apiService from '@/api/apiService';
import apiRoutes from '@/api/apiRoutes';
import { BadgeCheck } from 'lucide-react';
import PageTitle from '@/components/seo/pageTitle';

const formSchema = z.object({
  email: z.string()
    .min(1, 'Email est requis')
    .email('Email invalide'),
});

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [isMailSent, setIsMailSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const postData = {email: values.email, accountType: "admin"}
      await apiService.post({url: apiRoutes.admin.utils.resetPasswordInit, body: postData});
      setIsMailSent(true)
    } catch (error) {
      if(error instanceof Error) {apiService.handleError(error.message, { form}) }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle title="Mot de passe oublié" />
      <div>
          {/* Logo Section */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <img id="logoIcon" alt="logo" src={genralConfig?.iconUrl || "/fallback-icon.png"} />
          </div>

          {/* Main Content */}
          <div className="md:border md:rounded-md">
            {!isMailSent ? (
              // Forgot Password Form
              <div>
                <div className="space-y-2 px-5">
                  <div>
                    <h1 className="text-2xl mt-4 mb-2 text-center font-semibold tracking-tight">Mot de passe oublié</h1>
                  </div>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-5">
                    <p className="text-sm text-center text-muted-foreground">
                      Entrez votre email pour recevoir un lien de réinitialisation
                    </p>
                    <FormField 
                      control={form.control} 
                      name="email" 
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                          
                            <Input
                              className={`text-center ${FormInputHelper.getInputBorderClass(form, "email", field.value)}`}
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ButtonWithLoading type="submit" classList="w-full" title="Envoyer le mail" loading={loading} />
                  </form>
                </Form>
              </div>
            ) : (
              // Email Sent Confirmation
              <div className='space-y-2 px-5'>
                <BadgeCheck className="mx-auto h-12 w-12 text-green-500 mt-6" />
                <h1 className="text-2xl font-semibold tracking-tight text-center mt-5">Email envoyé</h1>
                <p className="text-sm text-muted-foreground text-center">
                  Si un compte existe avec cet email, vous recevrez un lien de
                  réinitialisation.
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
  )
}