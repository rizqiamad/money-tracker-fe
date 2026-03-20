import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { api } from "../helpers/axios";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import SubmitButton from "../components/SubmitButton";
import Input from "../components/Input";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) => api.post("/ms_user/forgot_password", { email }),
    onSuccess: () => {
      toast.success("Instruksi reset password telah dikirim ke email kamu.");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memproses permintaan");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    if (!email) return toast.warn("Silakan masukkan email Anda");
    mutate(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
        <p className="text-slate-400 text-sm mt-1">
          Masukkan email yang terdaftar dan kami akan mengirimkan tautan untuk mengatur ulang password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="email" label="Alamat Email" type="email" icon={<Mail size={15} />} />

        <div className="pt-1">
          <SubmitButton isPending={isPending} text="Kirim Instruksi Reset" textLoading="Mengirim..." />
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <span className="text-slate-400 text-sm">Ingat password? </span>
        <Link to="/login" className="text-blue-600 font-bold text-sm hover:underline underline-offset-4 transition">
          Kembali login
        </Link>
      </div>
    </motion.div>
  );
}