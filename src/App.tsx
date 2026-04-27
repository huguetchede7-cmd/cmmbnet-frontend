import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/root-layout';
import { AuthLayout } from '@/components/layout/auth-layout';
import { LoginPage } from '@/pages/auth/login';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password';
import { ResetPasswordPage } from './pages/auth/reset-password';
import DashboardLayout from "@/components/layout/dashboard-layout.tsx"
import { routeHelpers } from "@/helpers/routeHelpers.ts"
import DashboardPage from "@/pages/app/dashboard-page.tsx"
import LogoutPage from "@/pages/app/profil/logout.tsx"
import AdministratorPage from "@/pages/app/administrators/AdministratorPage.tsx"
import CreateAdministratorPage from "@/pages/app/administrators/CreateAdministratorPage.tsx"
import DetailAdministratorPage from "@/pages/app/administrators/DetailAdministratorPage"
import ClientsListesPages from './pages/app/clients/clients-listes-pages';
import CreateClientPage from "@/pages/app/clients/create-clients-pages.tsx"
import ComptesListesPages from "@/pages/app/comptes/comptes-listes-pages.tsx"
import CreateComptePage from "@/pages/app/comptes/create-compte-pages.tsx"
import DepotsListesPages from "@/pages/app/epargne/depots-listes-pages.tsx"
import CreateDepotPage from "@/pages/app/epargne/create-depot-pages.tsx"
import RetraitsListesPages from "@/pages/app/epargne/retraits-listes-pages.tsx"
import CreateRetraitPage from "@/pages/app/epargne/create-retrait-pages.tsx"
import HistoriquePages from "@/pages/app/transactions/historique-pages.tsx"
import CreateTransfertPage from "@/pages/app/transactions/create-transfert-pages.tsx"
import PaiementsListesPages from "@/pages/app/paiements/paiements-listes-pages.tsx"
import FacturesListesPages from "@/pages/app/paiements/factures-listes-pages.tsx"
import RapportFinancierPages from "@/pages/app/rapports/rapport-financier-pages.tsx"
import RapportEpargnePages from "@/pages/app/rapports/rapport-epargne-pages.tsx"
import GroupesPages from "@/pages/app/clients/groupes-pages.tsx"
import CreateGroupePage from "@/pages/app/clients/create-groupe-pages.tsx"
import DetailGroupePage from "@/pages/app/clients/detail-groupe-pages.tsx"

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
  <Route path="groupes" element={<GroupesPages />} />
  <Route path="groupes/create" element={<CreateGroupePage />} />
  <Route path="groupes/detail/:id" element={<DetailGroupePage />} />
  <Route path="comptes" element={<ComptesListesPages />} />
  <Route path="comptes/create" element={<CreateComptePage />} />
  <Route path="epargne/depots" element={<DepotsListesPages />} />
  <Route path="epargne/depots/create" element={<CreateDepotPage />} />
  <Route path="epargne/retraits" element={<RetraitsListesPages />} />
  <Route path="epargne/retraits/create" element={<CreateRetraitPage />} />
  <Route path="transactions/historique" element={<HistoriquePages />} />
  <Route path="transactions/transfert" element={<CreateTransfertPage />} />
  <Route path="paiements" element={<PaiementsListesPages />} />
  <Route path="paiements/factures" element={<FacturesListesPages />} />
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