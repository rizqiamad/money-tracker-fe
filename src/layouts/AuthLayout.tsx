import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router";

export default function AuthLayout() {
  const location = useLocation();
  // Sinkronisasi state mode dengan URL saat ini
  const [mode, setMode] = useState(location.pathname.includes("register") ? "register" : "login");

  useEffect(() => {
    setMode(location.pathname.includes("register") ? "register" : "login");
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 p-4 overflow-hidden">
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-5xl flex flex-col md:flex-row bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden">

        {/* LEFT SIDE: BRAND & TOGGLE */}
        <div className="relative w-full md:w-[40%] bg-blue-600 p-10 flex flex-col justify-between text-white overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><path d="M0 0h100v100H0z" fill="url(#grid)" /></svg>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <img src="/guardana-logo.png" alt="G" className="w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Guardana</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-4xl font-extrabold leading-tight">
                  {mode === "login" ? "Selamat Datang Kembali!" : "Mulai Perjalanan Finansialmu."}
                </h2>
                <p className="mt-4 text-blue-100 text-lg leading-relaxed">
                  {mode === "login"
                    ? "Kelola pengeluaran dengan lebih cerdas dan pantau setiap rupiah yang Anda simpan."
                    : "Bergabunglah dengan ribuan pengguna yang telah berhasil mengatur keuangan mereka."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            <p className="text-blue-200 mb-4 text-sm">
              {mode === "login" ? "Belum punya akun?" : "Sudah memiliki akun?"}
            </p>
            <Link to={mode === "login" ? "/register" : "/login"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:bg-blue-50 transition-colors"
              >
                {mode === "login" ? "Daftar Sekarang" : "Masuk ke Akun"}
              </motion.button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="w-full md:w-[60%] bg-white p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              <Outlet
                context={{
                  onSwitchToRegister: () => setMode("register"),
                  onSwitchToLogin: () => setMode("login")
                }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}