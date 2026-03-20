import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Navigate, Outlet, useLocation } from "react-router";
import { api } from "../helpers/axios";
import Loading from "../components/Loading";
import { BarChart2, ShieldCheck, TrendingUp } from "lucide-react";

interface IAuthContent {
  title: string;
  description: string;
  footerText: string;
  buttonText: string;
  linkTo: string;
}

const AUTH_CONTENT: Record<string, IAuthContent> = {
  "/login": {
    title: "Selamat Datang\nKembali!",
    description: "Pantau setiap rupiah, capai kebebasan finansialmu.",
    footerText: "Belum punya akun?",
    buttonText: "Daftar Gratis",
    linkTo: "/register",
  },
  "/register": {
    title: "Mulai Perjalanan\nFinansialmu.",
    description: "Bergabung bersama pengguna yang sudah cerdas kelola keuangan.",
    footerText: "Sudah punya akun?",
    buttonText: "Masuk ke Akun",
    linkTo: "/login",
  },
  "/register/verify_otp": {
    title: "Satu Langkah\nLagi!",
    description: "Verifikasi email untuk mengamankan akun barumu.",
    footerText: "Email salah?",
    buttonText: "Ubah Email",
    linkTo: "/register",
  },
  "/forgot_password": {
    title: "Lupa\nPassword?",
    description: "Tenang, kami bantu kamu masuk kembali dengan aman.",
    footerText: "Ingat passwordmu?",
    buttonText: "Kembali Login",
    linkTo: "/login",
  },
  "/reset_password": {
    title: "Atur Ulang\nPassword.",
    description: "Buat password baru yang kuat untuk akun kamu.",
    footerText: "Sudah ingat password?",
    buttonText: "Kembali Login",
    linkTo: "/login",
  },
};

const FEATURES = [
  {
    icon: BarChart2,
    label: "Lacak semua transaksi",
    desc: "Catat pemasukan & pengeluaran dengan mudah",
  },
  {
    icon: TrendingUp,
    label: "Laporan keuangan",
    desc: "Visualisasi arus kas bulanan secara otomatis",
  },
  {
    icon: ShieldCheck,
    label: "Aman & terenkripsi",
    desc: "Data keuanganmu tersimpan dengan aman",
  },
];

const getNormalizedPath = (path: string) => {
  if (path.includes("/verify_otp/")) return "/register/verify_otp";
  if (path.includes("/reset_password/")) return "/reset_password";
  return path;
};

export default function AuthLayout() {
  const location: { pathname: string } = useLocation();
  const content =
    AUTH_CONTENT[getNormalizedPath(location.pathname)] || AUTH_CONTENT["/login"];

  const { error, isLoading, data } = useQuery({
    queryKey: ["profile_auth_layout"],
    queryFn: () => api.get("/ms_user/profile"),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isLoading) return <Loading />;

  // Already logged in → redirect to dashboard
  if (data?.status === 200) return <Navigate to="/dashboard" />;

  // Not logged in (API returned error) → show auth layout
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        {/* ── Outer Card ── */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 min-h-[600px]">

          {/* ════ LEFT PANEL ════ */}
          <div className="relative w-full md:w-[42%] bg-slate-950 flex flex-col justify-between p-8 md:p-10 overflow-hidden">
            {/* Decorative orbs */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/25 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Top: Logo */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                  <img src="/guardana-logo.png" alt="Guardana" className="w-5" />
                </div>
                <span className="text-white text-xl font-bold tracking-tight">Guardana</span>
              </div>

              {/* Dynamic title */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight whitespace-pre-line">
                    {content.title}
                  </h2>
                  <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                    {content.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Feature highlights */}
              <div className="mt-10 space-y-4">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                    className="flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-600/20 border border-blue-500/20 shrink-0 mt-0.5">
                      <f.icon size={13} className="text-blue-400" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold leading-tight">{f.label}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom: CTA */}
            <div className="relative z-10 mt-10 md:mt-0">
              {content.footerText && (
                <p className="text-slate-500 text-xs mb-3">{content.footerText}</p>
              )}
              <Link to={content.linkTo}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer w-full md:w-auto px-7 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
                >
                  {content.buttonText}
                </motion.button>
              </Link>
            </div>
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <div className="w-full md:w-[58%] bg-white flex flex-col justify-center px-8 py-10 md:px-14 md:py-12">
            <div className="w-full max-w-sm mx-auto">
              <AnimatePresence mode="wait">
                <Outlet />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );

  return null;
}