import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import InputTransactionPage from "./pages/InputTransactionPage";
import AccountsPage from "./pages/AccountPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />

          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<InputTransactionPage />} />
          <Route path="account" element={<AccountsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}