import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { api } from "../helpers/axios";
import type { FormEvent } from "react";
import SubmitButton from "../components/SubmitButton";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

interface IReqBody {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useMutation<AxiosResponse<any, any, {}>, AxiosError<any, any>, IReqBody>({
    mutationFn: (body: IReqBody) => {
      return api.post("/ms_user/login", body)
    },
    onSuccess: ({ data }) => {
      console.log(data)
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data.message)
      console.log(err)
    }
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value

    mutate({ email, password })
  }

  return (
    <motion.div
      key="login"
      initial={{ y: 40, opacity: 0 }} // Muncul dari bawah
      animate={{ y: 0, opacity: 1 }}  // Ke posisi normal
      exit={{ y: -40, opacity: 0 }}   // Keluar ke atas
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mb-4">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang</h2>
        <p className="text-slate-500 mt-1">Silakan masuk untuk akses dashboard kamu.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input name="email" label="Email" type="email" />
        <div className="space-y-1">
          <Input name="password" label="Password" type="password" />
          <div className="text-right">
            <Link to={'/forgot_password'} className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700">Lupa Password?</Link>
          </div>
        </div>

        <SubmitButton isPending={isPending} text="Masuk ke akun" textLoading="Proses..." />
      </form>

      <div className="pt-6 text-center border-t border-slate-100">
        <span className="text-slate-500 text-sm">Belum punya akun? </span>
        <Link to="/register" className="text-blue-600 font-bold hover:underline underline-offset-4">
          Daftar Gratis
        </Link>
      </div>
    </motion.div>
  );
}