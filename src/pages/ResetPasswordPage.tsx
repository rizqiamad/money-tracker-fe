import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Navigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../helpers/axios";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff } from "lucide-react";
import SubmitButton from "../components/SubmitButton";
import type { AxiosError, AxiosResponse } from "axios";
import Loading from "../components/Loading";

function PasswordField({ name, label }: { name: string; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="group">
      <label className="block mb-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Lock size={15} />
        </div>
        <input
          name={name}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200
                     focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 text-slate-800 text-sm"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  const { isPending, error } = useQuery<AxiosResponse<any, any, {}>, AxiosError<any, any>>({
    queryKey: ["ms_user_verify_token_reset_password"],
    queryFn: () => api.post(`/ms_user/verify_token`, { token }),
  });

  const { mutate, isPending: isPendingMutation } = useMutation({
    mutationFn: (password: string) =>
      api.patch("/ms_user/reset_password", { token, new_password: password }),
    onSuccess: () => {
      toast.success("Password berhasil diperbarui! Silakan login kembali.");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui password");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = e.currentTarget.password.value;
    const confirmPassword = e.currentTarget.confirmPassword.value;
    if (password !== confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok");
    }
    mutate(password);
  };

  if (isPending) return <Loading />;
  if (error) {
    toast.error(error.response?.data.message);
    return <Navigate to="/login" replace />;
  }

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
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Password Baru</h2>
        <p className="text-slate-400 text-sm mt-1">
          Buat password yang kuat dan mudah kamu ingat.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField name="password" label="Password Baru" />
        <PasswordField name="confirmPassword" label="Konfirmasi Password" />

        <div className="pt-1">
          <SubmitButton isPending={isPendingMutation} text="Perbarui Password" textLoading="Memperbarui..." />
        </div>
      </form>
    </motion.div>
  );
}