import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { IUserAccount } from "../../types/userAccount";
import { api } from "../../helpers/axios";
import { formatIDR } from "../../helpers/format";
import UserAccountSkeleton from "./UserAccountSkeleton";
import EmptyState from "../EmptyState";
import { Wallet2 } from "lucide-react";

export default function UserAccountList() {
  const { data, isLoading } = useQuery({
    queryKey: ['user_account', 'list'],
    queryFn: () => api.post('/user_account/list'),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity
  });
  const userAccounts: IUserAccount[] = data?.data.data || []

  if (isLoading) return <UserAccountSkeleton />;

  if (!userAccounts.length) return <EmptyState icon={Wallet2} />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {userAccounts.map((item) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-700" />
          <p className="text-sm text-slate-500 font-medium">{item.ms_account_name}</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">{formatIDR(item.amount)}</h3>
        </div>
      ))}
    </motion.div>
  )
}