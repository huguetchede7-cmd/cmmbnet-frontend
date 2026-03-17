import { LogOut, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { routeHelpers } from '@/helpers/routeHelpers';
import { TinyAvatar } from '@/components/useful/AdvancedAvatar.tsx'

export function UserNav({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <TinyAvatar
            image={
              user?.avatar &&
                !user.avatar.includes("default_profil.jpg")
                ? user.avatar
                : null
            }
            name={user?.fullname || 'Utilisateur'}
            size={"sm"}
            showTooltip
            status={"online"}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='cursor-pointer hover:bg-gray-200 hover:text-black text-black' onClick={() => navigate(routeHelpers.dashboard.profil_settings)}>
            <User className="mr-2 h-4 w-4" />
            <span>Mon Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer hover:bg-red-50 hover:text-white text-red-500 hover:text-red-500' style={{ color: 'red' }} onClick={() => onLogout()}>
          <LogOut className="mr-2 h-4 w-4" style={{ color: 'red' }} />
          <span style={{ color: 'red' }}>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}