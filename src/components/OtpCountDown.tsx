import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "../helpers/axios";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

interface IReqBody {
  otp_type: "email",
  token: string
}

interface IProps {
  token: string
}

export default function OtpCountDown({ token }: IProps) {
  const defaultTimer = 59;
  const [timer, setTimer] = useState<number>(defaultTimer);

  const { mutate } = useMutation<AxiosResponse<any, any, {}>, AxiosError<any, any>, IReqBody>({
    mutationFn: (body: IReqBody) => {
      return api.post("/ms_user/resend_otp", body)
    },
    onSuccess: ({ data }) => {
      toast.success(data.message)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const resendtOtp = () => {
    setTimer(defaultTimer)
    mutate({ otp_type: "email", token })
  }

  return (
    <p className="text-slate-500 text-sm">
      Tidak menerima kode?{" "}
      {timer > 0 ? (
        <span className="text-blue-600 font-medium">Kirim ulang dalam {timer}s</span>
      ) : (
        <button
          type="button"
          onClick={resendtOtp}
          className="text-blue-600 font-bold hover:underline"
        >
          Kirim Ulang
        </button>
      )}
    </p>
  )
}