import { motion } from "framer-motion";
import { type IUserAccount } from "../../types/userAccount";
import { formatIDR } from "../../helpers/format";
import { getAccountVisuals } from "./accountUtils";

export default function AccountCard({ account, delay }: { account: IUserAccount, delay: number }) {
  const visuals = getAccountVisuals(account.ms_account_type);
  const Icon = visuals.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`min-w-[240px] p-5 rounded-2xl bg-gradient-to-br ${visuals.color} text-white shadow-lg relative overflow-hidden group h-[140px] flex flex-col justify-between`}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

      <div className="flex justify-between items-start relative z-10">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest bg-black/20 px-2 py-1 rounded-md backdrop-blur-md">
          {visuals.label}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-white/70 text-xs font-medium truncate mb-0.5">{account.ms_account_name}</p>
        <p className="text-xl font-black tabular-nums tracking-tight">{formatIDR(account.amount)}</p>
      </div>
    </motion.div>
  );
}