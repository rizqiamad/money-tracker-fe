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
import { Mail } from "lucide-react";

interface IReqBody {
  otp: string;
  otp_type: "email";
  token: string;
}

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorOtp, setErrorOtp] = useState<string>("");
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();
  let { token } = useParams();

  if (!token || token === "undefined") {
    return <Navigate to="/register" replace />;
  }

  const { isPending, error } = useQuery<AxiosResponse<any, any, {}>, AxiosError<any, any>>({
    queryKey: ["ms_user_verify_token"],
    queryFn: () => api.post(`/ms_user/verify_token`, { token }),
  });

  const { mutate, isPending: isMutationPending } = useMutation<
    AxiosResponse<any, any, {}>,
    AxiosError<any, any>,
    IReqBody
  >({
    mutationFn: (body: IReqBody) => api.post("/ms_user/verify_otp", body),
    onSuccess: ({ data }) => {
      toast.success(data.message);
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data.message);
      console.log(err);
    },
  });

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < otp.length) {
      setErrorOtp("Lengkapi semua digit kode OTP");
    } else {
      setErrorOtp("");
    }
    mutate({ otp: otpValue, otp_type: "email", token });
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    const pasteData = data.split("").slice(0, otp.length);
    const newOtp = [...otp];
    pasteData.forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);
    const lastIndex = Math.min(pasteData.length, otp.length - 1);
    inputRefs.current[lastIndex].focus();
  };

  if (isPending) return <Loading />;
  if (error) {
    toast.error(error.response?.data.message);
    return <Navigate to="/register" replace />;
  }

  const decoded = jwtDecode<{ email: string }>(token);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verifikasi Email</h2>
        <p className="text-slate-400 text-sm mt-1">
          Kode OTP telah dikirim ke
        </p>
        {/* Email chip */}
        <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl w-fit">
          <Mail size={13} className="text-blue-500 shrink-0" />
          <span className="text-sm font-semibold text-blue-700">{decoded.email}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Boxes */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Masukkan kode 6 digit</p>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => { inputRefs.current[index] = el!; }}
                value={digit}
                onPaste={handlePaste}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 md:w-11 md:h-13 text-center text-xl font-black rounded-xl border-2 outline-none transition-all duration-200
                  ${digit
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  }`}
              />
            ))}
          </div>
          {errorOtp && (
            <p className="text-xs text-red-500 mt-2 font-medium">⚠ {errorOtp}</p>
          )}
        </div>

        <div className="space-y-3">
          <SubmitButton isPending={isMutationPending} text="Verifikasi Sekarang" textLoading="Memverifikasi..." />
          <div className="text-center">
            <OtpCountDown token={token} />
          </div>
        </div>
      </form>
    </motion.div>
  );
}