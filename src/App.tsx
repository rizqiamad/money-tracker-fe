import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import InputTransactionPage from "./pages/InputTransactionPage";
import AccountsPage from "./pages/AccountPage";
import RecordsPage from "./pages/RecordsPage";
import { QueryClientProvider } from "@tanstack/react-query";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import MainLayout from "./layouts/MainLayout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { queryClient } from "./helpers/query";
import ProfilePage from "./pages/ProfilePage";
import GuardLayout from "./layouts/GuardLayout";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route index element={<Navigate to="/login" replace />} />

              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot_password" element={<ForgotPasswordPage />} />
              <Route path="reset_password/:token" element={<ResetPasswordPage />} />
              <Route path="register/verify_otp/:token" element={<VerifyOtpPage />} />
            </Route>

            {/* Guarded Routes */}
            <Route element={<GuardLayout />}>

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="transactions" element={<InputTransactionPage />} />
                <Route path="account" element={<AccountsPage />} />
                <Route path="records" element={<RecordsPage />} />
              </Route>

              <Route path="profile" element={<ProfilePage />} />
            </Route>

          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}