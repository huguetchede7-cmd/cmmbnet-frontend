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
import DetailAdministratorPage from "@/pages/app/administrators/DetailAdiministratorPage.tsx"

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
            <Route path={routeHelpers.dashboard.index} element={<DashboardPage />} />

            <Route path={routeHelpers.dashboard.administrator.index} element={<AdministratorPage />} />
            <Route path={routeHelpers.dashboard.administrator.create} element={<CreateAdministratorPage />} />
            <Route path={`${routeHelpers.dashboard.administrator.show}/:id`} element={<DetailAdministratorPage />} />

            {/*<Route path={`/dashboard/403`} element={<ForbiddenPage />} />*/}
            <Route path={routeHelpers.dashboard.logout} element={<LogoutPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;