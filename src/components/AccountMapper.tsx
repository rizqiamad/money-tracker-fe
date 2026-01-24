import { Wallet, Landmark, CreditCard, Coins } from "lucide-react";
import type { JSX } from "react";

export const ACCOUNT_MAPPER: Record<string, { icon: JSX.Element; color: string }> = {
  bca: {
    icon: <Landmark size={20} />,
    color: "bg-blue-50 text-blue-600"
  },
  mandiri: {
    icon: <Landmark size={20} />,
    color: "bg-yellow-50 text-yellow-600"
  },
  cash: {
    icon: <Wallet size={20} />,
    color: "bg-emerald-50 text-emerald-600"
  },
  gopay: {
    icon: <Coins size={20} />,
    color: "bg-sky-50 text-sky-600"
  },
  // Default fallback jika kode tidak dikenali
  default: {
    icon: <CreditCard size={20} />,
    color: "bg-slate-50 text-slate-600"
  }
};