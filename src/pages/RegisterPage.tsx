import { Link, useOutletContext } from "react-router";
import Input from "../components/Input";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { onSwitchToLogin } = useOutletContext<{ onSwitchToLogin: () => void }>();

  return (
    <motion.div
      key="register"
      initial={{ y: 40, opacity: 0 }} // Muncul dari bawah
      animate={{ y: 0, opacity: 1 }}  // Ke posisi normal
      exit={{ y: -40, opacity: 0 }}   // Keluar ke atas
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daftar Akun</h2>
        <p className="text-slate-500 mt-2">Mulai kelola keuanganmu dengan lebih baik.</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Nama Lengkap" />
        <Input label="Email" type="email" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Password" type="password" />
          <Input label="Konfirmasi" type="password" />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all mt-4"
        >
          Buat Akun Sekarang
        </motion.button>
      </form>

      <div className="pt-4 text-center">
        <span className="text-slate-500 text-sm">Sudah punya akun? </span>
        <Link to="/login" onClick={onSwitchToLogin} className="text-blue-600 font-bold hover:underline underline-offset-4">
          Masuk di sini
        </Link>
      </div>
    </motion.div>
  );
}