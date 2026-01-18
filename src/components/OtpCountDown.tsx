import { useEffect, useState } from "react";

export default function OtpCountDown() {
  const [timer, setTimer] = useState<number>(59);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <p className="text-slate-500 text-sm">
      Tidak menerima kode?{" "}
      {timer > 0 ? (
        <span className="text-blue-600 font-medium">Kirim ulang dalam {timer}s</span>
      ) : (
        <button
          type="button"
          onClick={() => setTimer(59)}
          className="text-blue-600 font-bold hover:underline"
        >
          Kirim Ulang
        </button>
      )}
    </p>
  )
}