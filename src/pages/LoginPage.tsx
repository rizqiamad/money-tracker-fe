import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { api } from "../helpers/axios";
import type { FormEvent } from "react";
import SubmitButton from "../components/SubmitButton";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Mail, Lock } from "lucide-react";

interface IReqBody {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation<AxiosResponse<any, any, {}>, AxiosError<any, any>, IReqBody>({
    mutationFn: (body: IReqBody) => api.post("/ms_user/login", body),
    onSuccess: () => navigate("/dashboard"),
    onError: (err) => {
      toast.error(err.response?.data.message);
      console.log(err);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    mutate({ email, password });
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Masuk ke Akun</h2>
        <p className="text-slate-400 text-sm mt-1">Kelola keuanganmu hari ini.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input name="email" label="Email" type="email" icon={<Mail size={15} />} />

        <div className="space-y-1">
          <Input name="password" label="Password" type="password" icon={<Lock size={15} />} />
          <div className="text-right pt-1">
            <Link
              to="/forgot_password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Lupa Password?
            </Link>
          </div>
        </div>

        <div className="pt-1">
          <SubmitButton isPending={isPending} text="Masuk ke Akun" textLoading="Memproses..." />
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <span className="text-slate-400 text-sm">Belum punya akun? </span>
        <Link to="/register" className="text-blue-600 font-bold text-sm hover:underline underline-offset-4 transition">
          Daftar Gratis
        </Link>
      </div>
    </motion.div>
  );
}