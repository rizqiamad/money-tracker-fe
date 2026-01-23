import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Navigate, Outlet, useLocation } from "react-router";
import { api } from "../helpers/axios";
import Loading from "../components/Loading";

interface IAuthContent {
  title: string;
  description: string;
  footerText: string;
  buttonText: string;
  linkTo: string;
}

const AUTH_CONTENT: Record<string, IAuthContent> = {
  "/login": {
    title: "Selamat Datang Kembali!",
    description: "Kelola pengeluaran dengan lebih cerdas dan pantau setiap rupiah yang Anda simpan.",
    footerText: "Belum punya akun?",
    buttonText: "Daftar Sekarang",
    linkTo: "/register"
  },
  "/register": {
    title: "Mulai Perjalanan Finansialmu.",
    description: "Bergabunglah dengan ribuan pengguna yang telah berhasil mengatur keuangan mereka.",
    footerText: "Sudah memiliki akun?",
    buttonText: "Masuk ke Akun",
    linkTo: "/login"
  },
  "/register/verify_otp": {
    title: "Langkah Terakhir Verifikasi.",
    description: "Masukkan kode yang kami kirimkan untuk memastikan keamanan akun Anda.",
    footerText: "Salah memasukkan email?",
    buttonText: "Ubah Email",
    linkTo: "/register"
  },
  "/forgot_password": {
    title: "Masukkan email yang terdaftar.",
    description: "Jangan khawatir, kami akan membantu Anda mendapatkan akses kembali ke akun Anda.",
    footerText: "",
    buttonText: "Kembali Login",
    linkTo: "/login"
  },
  "/reset_password": {
    title: "Atur Ulang Kata Sandi.",
    description: "Jangan khawatir, kami akan membantu Anda mendapatkan akses kembali ke akun Anda.",
    footerText: "Ingat kata sandi?",
    buttonText: "Kembali ke login",
    linkTo: "/login"
  }
};

const getNormalizedPath = (path: string) => {
  if (path.includes("/verify_otp/")) return "/register/verify_otp";
  if (path.includes("/reset_password/")) return "/reset_password";
  return path;
};

export default function AuthLayout() {
  const location: { pathname: string } = useLocation();
  const content = AUTH_CONTENT[getNormalizedPath(location.pathname)] || AUTH_CONTENT["/login"];

  const { error, isLoading, data } = useQuery({
    queryKey: ['profile_auth_layout'],
    queryFn: () =>
      api.get('/ms_user/profile'),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false
  })

  if (isLoading) {
    return <Loading />
  }

  if (data?.status == 200) {
    return <Navigate to={'/dashboard'} />
  }

  if (error) return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 p-4 overflow-hidden">
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-5xl flex flex-col md:flex-row bg-white/5 border border-white/10 backdrop-blur-xl rounded-4xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE: BRAND & DYNAMIC CONTENT */}
        <div className="relative w-full md:w-[40%] bg-blue-600 p-10 flex flex-col justify-between text-white overflow-hidden transition-colors duration-500">

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <img src="/guardana-logo.png" alt="G" className="w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Guardana</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-4xl font-extrabold leading-tight">
                  {content.title}
                </h2>
                <p className="mt-4 text-blue-100 text-lg leading-relaxed">
                  {content.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            <p className="text-blue-200 mb-4 text-sm">{content.footerText}</p>
            <Link to={content.linkTo}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer w-full md:w-auto px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:bg-blue-50 transition-colors"
              >
                {content.buttonText}
              </motion.button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="w-full md:w-[60%] bg-white p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}