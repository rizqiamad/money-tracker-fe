import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Navigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../helpers/axios";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff } from "lucide-react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import type { AxiosError, AxiosResponse } from "axios";
import Loading from "../components/Loading";
import { jwtDecode } from "jwt-decode";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  // Proteksi jika token tidak ada di URL
  if (!token || token == 'undefined') {
    return <Navigate to={'/register'} replace />
  }

  const { isPending, error } = useQuery<AxiosResponse<any, any, {}>, AxiosError<any, any>>({
    queryKey: ['ms_user_verify_token_reset_password'],
    queryFn: () => {
      return api.post(`/ms_user/verify_token`, { token })
    },
  })

  const { mutate, isPending: isPendingMutation } = useMutation({
    mutationFn: (password: string) => {
      return api.post("/ms_user/reset_password", { token, new_password: password });
    },
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

    const password = e.currentTarget.password.value
    const confirmPassword = e.currentTarget.confirmPassword.value

    if (password !== confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok");
    }

    mutate(password);
  };

  if (isPending) {
    return <Loading />
  }

  if (error) {
    toast.error(error.response?.data.message)
    return <Navigate to={'/login'} replace />
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
        <p className="text-slate-500 mt-2">
          Silakan masukkan password baru Anda. Pastikan password Anda kuat dan mudah diingat.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input type="password" placeholder="******" name="password" label="Password" />
        <Input type="password" placeholder="******" name="confirmPassword" label="Konfirmasi Password" />
        <SubmitButton isPending={isPendingMutation} text="Perbarui Password" textLoading="Memperbarui Password..." />
      </form>
    </motion.div>
  );
}