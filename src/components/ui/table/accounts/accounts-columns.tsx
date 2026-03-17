import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { User } from './schema'
import { accountsTypes, callTypes } from './account-data'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '../data-table-column-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileHelpers } from '@/helpers/FileHelpers'
import { DateHelpers } from '@/helpers/DateHelpers'
import { UserHelpers } from '@/helpers/UserHelpers.ts'

export const AccountColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'account_type_text',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const { account_type_text} = row.original
      const userType = accountsTypes.find(({ value }) => value === account_type_text)

      if (!userType) {
        return null
      }

      return (
        <div className='flex gap-x-2  py-1 px-2'>
          {userType.icon && (
            <userType.icon size={16} className='text-muted-foreground' />
          )}
          <span className='capitalize text-sm'>{row.getValue('account_type_text')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'fullname',
    accessorKey: 'fullname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nom' />
    ),
    cell: ({ row }) => {
      return <div className='flex items-center space-x-2'>
              <Avatar style={{ backgroundColor: UserHelpers.getInitialUser(row.getValue('fullname')).bgColor }}>
                <AvatarImage src={FileHelpers.formatToUrl(row.original.avatar)} alt="profil" />
                <AvatarFallback style={{ backgroundColor: UserHelpers.getInitialUser(row.getValue('fullname')).bgColor, color: UserHelpers.getInitialUser(row.getValue('fullname')).textColor }}>
                  {UserHelpers.getInitialUser(row.getValue('fullname')).initials}
                </AvatarFallback>
              </Avatar>
              <LongText >{row.getValue('fullname')}</LongText>
          </div>
    },
    meta: { className: 'w-16' },
  },
  {
    accessorKey: 'ban_statut_text',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const badgeColor = callTypes.get(row.getValue('ban_statut_text'))
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {row.getValue('ban_statut_text')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => {
     return <div>{row.getValue('phone') ? "+"+(`${row.getValue('phone')} ` as string)?.replace('_', ' ') : "-"}</div>
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date inscrpition' />
    ),
    cell: ({ row }) => {
     return <div>{DateHelpers.formatDate(row.getValue('created_at'))}</div>
    },
  }
]
