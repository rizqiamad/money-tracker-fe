import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "../helpers/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SubmitButton from "../components/SubmitButton";
import type { AxiosError, AxiosResponse } from "axios";
import { User, Mail, Lock } from "lucide-react";

interface IReqBody {
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation<AxiosResponse<any, any, {}>, AxiosError<any, any>, IReqBody>({
    mutationFn: (reqBody: IReqBody) => api.post("/ms_user/register", reqBody),
    onSuccess: async ({ data }) => {
      toast.success(data.message);
      navigate(`/register/verify_otp/${data.token}`);
    },
    onError: async (err) => {
      toast.error(err.response?.data.message);
      console.log(err);
    },
  });

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const username = e.currentTarget.username.value;
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    const confirmPassword = e.currentTarget.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }
    setError("");
    mutate({ username, email, password });
  }

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Buat Akun Baru</h2>
        <p className="text-slate-400 text-sm mt-1">Mulai perjalanan finansial yang lebih cerdas.</p>
      </div>

      <form className="space-y-4" onSubmit={submitForm}>
        <Input name="username" label="Nama Lengkap" icon={<User size={15} />} />
        <Input name="email" label="Email" type="email" icon={<Mail size={15} />} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="password" label="Password" type="password" icon={<Lock size={15} />} />
          <div>
            <Input name="confirmPassword" label="Konfirmasi Password" type="password" icon={<Lock size={15} />} />
            {error && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">⚠ {error}</p>
            )}
          </div>
        </div>

        <div className="pt-1">
          <SubmitButton isPending={isPending} text="Buat Akun Sekarang" textLoading="Mendaftarkan..." />
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <span className="text-slate-400 text-sm">Sudah punya akun? </span>
        <Link to="/login" className="text-blue-600 font-bold text-sm hover:underline underline-offset-4 transition">
          Masuk di sini
        </Link>
      </div>
    </motion.div>
  );
}