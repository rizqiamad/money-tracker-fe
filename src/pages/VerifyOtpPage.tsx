import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Navigate, useNavigate, useParams } from "react-router";
import { jwtDecode } from "jwt-decode";
import OtpCountDown from "../components/OtpCountDown";
import { api } from "../helpers/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import type { AxiosError, AxiosResponse } from "axios";
import SubmitButton from "../components/SubmitButton";

interface IReqBody {
  otp: string
  otp_type: "email",
  token: string
}

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorOtp, setErrorOtp] = useState<string>("");
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();
  let { token } = useParams();

  if (!token || token == 'undefined') {
    return <Navigate to={'/register'} replace />
  }

  const { isPending, error } = useQuery<AxiosResponse<any, any, {}>, AxiosError<any, any>>({
    queryKey: ['ms_user_verify_token'],
    queryFn: () => {
      return api.post(`/ms_user/verify_token`, { token })
    },
  })

  const { mutate, isPending: isMutationPending } = useMutation<AxiosResponse<any, any, {}>, AxiosError<any, any>, IReqBody>({
    mutationFn: (body: IReqBody) => {
      return api.post("/ms_user/verify_otp", body)
    },
    onSuccess: ({ data }) => {
      toast.success(data.message)
      navigate('/login')
    },
    onError: (err) => {
      toast.error(err.response?.data.message)
      console.log(err)
    }
  })

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Pindah ke input selanjutnya jika ada isinya
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Balik ke input sebelumnya jika backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < otp.length) {
      setErrorOtp("input valid otp to continue")
    } else {
      setErrorOtp("")
    }
    mutate({ otp: otpValue, otp_type: 'email', token })
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();

    const pasteData = data.split("").slice(0, otp.length); // Ambil 6 digit pertama
    const newOtp = [...otp];

    pasteData.forEach((char, index) => {
      newOtp[index] = char;
    });

    setOtp(newOtp);

    // Fokus ke input terakhir yang terisi atau input paling akhir
    const lastIndex = Math.min(pasteData.length, otp.length - 1);
    inputRefs.current[lastIndex].focus();
  };

  if (isPending) {
    return <Loading />
  }

  if (error) {
    toast.error(error.response?.data.message)
    return <Navigate to={'/register'} replace />
  }

  const decoded = jwtDecode<{ email: string }>(token);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Verifikasi Kode</h1>
        <p className="text-slate-500 mt-2">
          Kami telah mengirimkan kode OTP ke email <span className="font-semibold text-slate-700">{decoded.email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between gap-2">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(el) => { inputRefs.current[index] = el! }}
              value={data}
              onPaste={handlePaste}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:ring-0 focus:outline-none transition-all"
            />
          ))}
        </div>

        <div>
          <SubmitButton isPending={isMutationPending} text="Verifikasi sekarang" textLoading="Meverifikasi kode otp..." />
          {errorOtp && (
            <p className="text-sm text-red-500 mt-1">
              *{errorOtp}
            </p>
          )}
        </div>

        <div className="text-center">
          <OtpCountDown token={token} />
        </div>
      </form>
    </motion.div>
  );
}