import {
  IconBuilding,
  IconShield,
  IconTruckDelivery,
  IconUsers,
} from '@tabler/icons-react'
import { UserStatus } from './schema'

export const callTypes = new Map<UserStatus, string>([
  ['actif', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['suspendu', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
])

export const accountsTypes = [
  {
    label: 'Admin',
    value: 'Admin',
    icon: IconShield,
  },
  {
    label: 'Entreprise',
    value: 'Entreprise',
    icon: IconBuilding,
  },
   {
    label: 'Client',
    value: 'Client',
    icon: IconUsers,
  },
  {
    label: 'Livreur',
    value: 'Livreur',
    icon: IconTruckDelivery,
  },
] as const