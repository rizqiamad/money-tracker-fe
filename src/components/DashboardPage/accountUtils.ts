import { 
  Landmark, 
  Banknote, 
  Wallet, 
  TrendingUp, 
  CreditCard,
  type LucideIcon 
} from "lucide-react";

interface AccountVisuals {
  color: string;
  icon: LucideIcon;
  label: string;
}

export const getAccountVisuals = (type: string | undefined): AccountVisuals => {
  switch (type?.toLowerCase()) {
    case "bank":
      return {
        color: "from-blue-600 to-blue-800",
        icon: Landmark,
        label: "Bank",
      };
    case "cash":
      return {
        color: "from-emerald-500 to-teal-700",
        icon: Banknote,
        label: "Tunai",
      };
    case "wallet":
      return {
        color: "from-orange-500 to-rose-500",
        icon: Wallet,
        label: "E-Wallet",
      };
    case "investment":
      return {
        color: "from-indigo-500 to-purple-600",
        icon: TrendingUp,
        label: "Investasi",
      };
    default:
      return {
        color: "from-slate-500 to-slate-700",
        icon: CreditCard,
        label: "Lainnya",
      };
  }
};
