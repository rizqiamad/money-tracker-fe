import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import InputTransactionPage from "./pages/InputTransactionPage";
import AccountsPage from "./pages/AccountPage";
import ReportsPage from "./pages/ReportsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import MainLayout from "./layouts/MainLayout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient()

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

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="transactions" element={<InputTransactionPage />} />
              <Route path="account" element={<AccountsPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}