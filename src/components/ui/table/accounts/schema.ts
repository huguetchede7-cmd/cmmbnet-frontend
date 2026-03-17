import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('actif'),
  z.literal('suspendu'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('Admin'),
  z.literal('Entreprise'),
  z.literal('Client'),
  z.literal('Livreur'),
])

const userKYCSchema = z.union([
  z.literal('Non Verifiée'),
  z.literal('En attente'),
  z.literal('Effetuée'),
])

const userSchema = z.object({
  id: z.number(),
  fullname: z.string(),
  avatar: z.string(),
  email: z.string(),
  phone: z.string(),
  ban_statut_text: userStatusSchema,
  kyc_text: userKYCSchema,
  created_at: z.string(),
  account_type: z.number(),
  account_type_text: userRoleSchema,
  accountBusinesseName: z.string(),
  accountBusinessLogo: z.string()
})


export type User = z.infer<typeof userSchema>

export const AccountListSchema = z.array(userSchema)
