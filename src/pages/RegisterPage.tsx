import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "../helpers/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SubmitButton from "../components/SubmitButton";
import type { AxiosError, AxiosResponse } from "axios";

interface IReqBody {
  username: string
  email: string
  password: string
}

export default function RegisterPage() {
  const [error, setError] = useState<string>('')
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation<AxiosResponse<any, any, {}>, AxiosError<any, any>, IReqBody>({
    mutationFn: (reqBody: IReqBody) => {
      return api.post('/ms_user/register', reqBody)
    },
    onSuccess: async ({ data }) => {
      console.log(data)
      toast.success(data.message)
      navigate(`/register/verify_otp/${data.token}`)
    },
    onError: async (err) => {
      toast.error(err.response?.data.message)
      console.log(err)
    }
  })

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const username = e.currentTarget.username.value
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    const confirmPassword = e.currentTarget.confirmPassword.value

    if (password != confirmPassword) {
      setError("confirm password is not valid")
    } else {
      setError("")
    }

    mutate({ username, email, password })
  }

  return (
    <motion.div
      key="register"
      initial={{ y: 40, opacity: 0 }} // Muncul dari bawah
      animate={{ y: 0, opacity: 1 }}  // Ke posisi normal
      exit={{ y: -40, opacity: 0 }}   // Keluar ke atas
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mb-4">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daftar Akun</h2>
        <p className="text-slate-500 mt-1">Mulai kelola keuanganmu dengan lebih baik.</p>
      </div>

      <form className="space-y-4" onSubmit={submitForm}>
        <Input name="username" label="Nama Lengkap" />
        <Input name="email" label="Email" type="email" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input name="password" label="Password" type="password" />
          </div>
          <div>
            <Input name="confirmPassword" label="Konfirmasi Password" type="password" />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>
        </div>

        <SubmitButton isPending={isPending} text="Buat akun sekarang" textLoading="Mendaftarkan..." />
      </form>

      <div className="pt-4 text-center">
        <span className="text-slate-500 text-sm">Sudah punya akun? </span>
        <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
          Masuk di sini
        </Link>
      </div>
    </motion.div>
  );
}