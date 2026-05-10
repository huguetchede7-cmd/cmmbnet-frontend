import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/root-layout';
import { AuthLayout } from '@/components/layout/auth-layout';
import { LoginPage } from '@/pages/auth/login';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password';
import { ResetPasswordPage } from './pages/auth/reset-password';
import DashboardLayout from "@/components/layout/dashboard-layout.tsx"
import DashboardPage from "@/pages/app/dashboard-page.tsx"
import LogoutPage from "@/pages/app/profil/logout.tsx"
import AdministratorPage from "@/pages/app/administrators/AdministratorPage.tsx"
import CreateAdministratorPage from "@/pages/app/administrators/CreateAdministratorPage.tsx"
import DetailAdministratorPage from "@/pages/app/administrators/DetailAdministratorPage"
import ClientsListesPages from './pages/app/clients/clients-listes-pages';
import CreateClientPage from "@/pages/app/clients/create-clients-pages.tsx"
import DetailClientPages from "@/pages/app/clients/detail-client-pages.tsx"
import ComptesListesPages from "@/pages/app/comptes/comptes-listes-pages.tsx"
import CreateComptePage from "@/pages/app/comptes/create-compte-pages.tsx"
import DepotsListesPages from "@/pages/app/epargne/depots-listes-pages.tsx"
import CreateDepotPage from "@/pages/app/epargne/create-depot-pages.tsx"
import RetraitsListesPages from "@/pages/app/epargne/retraits-listes-pages.tsx"
import CreateRetraitPage from "@/pages/app/epargne/create-retrait-pages.tsx"
import HistoriquePages from "@/pages/app/transactions/historique-pages.tsx"
import CreateTransfertPage from "@/pages/app/transactions/create-transfert-pages.tsx"
import RapportFinancierPages from "@/pages/app/rapports/rapport-financier-pages.tsx"
import RapportEpargnePages from "@/pages/app/rapports/rapport-epargne-pages.tsx"
import DetailComptePage from "@/pages/app/comptes/detail-compte-pages.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>

          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="password/reset" element={<ResetPasswordPage />} />
          </Route>

          <Route path="dashboard" element={<DashboardLayout />}>
  <Route path="home" element={<DashboardPage />} />
  <Route path="clients" element={<ClientsListesPages />} />
  <Route path="clients/create" element={<CreateClientPage />} />
  <Route path="clients/detail/:id" element={<DetailClientPages />} />
  <Route path="comptes" element={<ComptesListesPages />} />
  <Route path="comptes/create" element={<CreateComptePage />} />
  <Route path="comptes/detail/:id" element={<DetailComptePage />} />
  <Route path="epargne/depots" element={<DepotsListesPages />} />
  <Route path="epargne/depots/create" element={<CreateDepotPage />} />
  <Route path="epargne/retraits" element={<RetraitsListesPages />} />
  <Route path="epargne/retraits/create" element={<CreateRetraitPage />} />
  <Route path="transactions/historique" element={<HistoriquePages />} />
  <Route path="transactions/transfert" element={<CreateTransfertPage />} />
  <Route path="rapports/financier" element={<RapportFinancierPages />} />
  <Route path="rapports/epargne" element={<RapportEpargnePages />} />
  <Route path="administrator" element={<AdministratorPage />} />
  <Route path="administrator/create" element={<CreateAdministratorPage />} />
  <Route path="administrator/detail/:id" element={<DetailAdministratorPage />} />
  <Route path="logout" element={<LogoutPage />} />
</Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;