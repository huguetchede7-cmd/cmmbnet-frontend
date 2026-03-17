import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/layout/user-nav';
import { genralConfig } from '../../../config';

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

export function Header({ onMenuClick, onLogout }: HeaderProps) {

  return (
    <header className="sticky noprint top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1  flex gap-4 items-center">
          <div className='lg:hidden flex items-center' onClick={onMenuClick} >
            <Button variant="ghost" className='px-2 py-4 me-2'>
              <Menu color='black' />
            </Button>
            <p className='mb-0'>
              <span className='font-bold'>{genralConfig.appName}</span>
            </p>
          </div>
        </div>
        {/* <Button variant="ghost" className="mr-2 px-2 py-4 relative" onClick={() => navigate(routeHelpers.dashboard.notifications)}>
        {sharedData?.notifStatsLog?.unviewed > 0 && (
          <div style={{ position: 'absolute', top: -5, right: -5 }} className="px-1.5 py-0.5 border-white rounded-full text-xs font-semibold bg-red-500 text-white">
            {sharedData?.notifStatsLog?.unviewed}
          </div>
        )}

        <span className="sr-only">Notifications</span>
        </Button> */}
        <UserNav onLogout={onLogout} />
      </div>
    </header>
  );
}