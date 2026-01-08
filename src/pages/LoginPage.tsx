import { Link, useOutletContext } from "react-router";
import Input from "../components/Input";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { onSwitchToRegister } = useOutletContext<{ onSwitchToRegister: () => void }>();

  return (
    <motion.div
      key="login"
      initial={{ y: 40, opacity: 0 }} // Muncul dari bawah
      animate={{ y: 0, opacity: 1 }}  // Ke posisi normal
      exit={{ y: -40, opacity: 0 }}   // Keluar ke atas
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang</h2>
        <p className="text-slate-500 mt-2">Silakan masuk untuk akses dashboard kamu.</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <Input label="Email" type="email" />
        <div className="space-y-1">
          <Input label="Password" type="password" />
          <div className="text-right">
            <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Lupa Password?</button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all mt-2"
        >
          Masuk ke Akun
        </motion.button>
      </form>

      <div className="pt-6 text-center border-t border-slate-100">
        <span className="text-slate-500 text-sm">Belum punya akun? </span>
        <Link to="/register" onClick={onSwitchToRegister} className="text-blue-600 font-bold hover:underline underline-offset-4">
          Daftar Gratis
        </Link>
      </div>
    </motion.div>
  );
}