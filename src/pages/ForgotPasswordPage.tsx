import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { api } from "../helpers/axios";
import { toast } from "react-toastify";
import { Mail } from "lucide-react"; // Opsional: untuk icon
import SubmitButton from "../components/SubmitButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) => {
      return api.post("/ms_user/forgot_password", { email });
    },
    onSuccess: () => {
      toast.success("Silahkan cek email anda");
      // Biasanya setelah ini diarahkan kembali ke login atau ke halaman 'Check Email'
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memproses permintaan");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return toast.warn("Silakan masukkan email Anda");
    }
    mutate(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Lupa Password?</h1>
        <p className="text-slate-500 mt-2">
          Jangan khawatir! Masukkan email yang terdaftar dan kami akan mengirimkan tautan untuk mengatur ulang password Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
            Alamat Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Mail size={20} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:ring-0 focus:outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        <SubmitButton isPending={isPending} text="Kirim Instruksi Reset" textLoading="Mengirim Permintaan..." />
      </form>
    </motion.div>
  );
}