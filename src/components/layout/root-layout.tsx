import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

export function RootLayout() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="admin-theme">
      <Outlet  />
      <Toaster />
    </ThemeProvider>
  );
}