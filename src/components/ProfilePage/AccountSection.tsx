import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, EyeOff, TrendingUp, Wallet2 } from "lucide-react";
import { ACCOUNT_MAPPER } from "./AccountMapper";
import { formatIDR } from "../../helpers/format";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../helpers/axios";

export default function AccountSection() {
  const [isHidden, setIsHidden] = useState<boolean>(true);

  const { data, isLoading } = useQuery({
    queryKey: ['user_account', 'list'],
    queryFn: () => api.post('/user_account/list'),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity
  });

  const accounts = data?.data?.data || [];

  const totalBalance = useMemo(() => {
    return accounts.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;
  }, [accounts]);

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="w-full p-10 flex flex-col items-center justify-center bg-white rounded-4xl border border-slate-100 shadow-sm">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Mengambil data akun...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SUMMARY CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-blue-600 rounded-4xl p-8 text-white shadow-xl shadow-blue-200"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <span className="text-sm font-medium tracking-wide uppercase">Total Kekayaan Bersih</span>
            <TrendingUp size={18} />
          </div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-extrabold tracking-tight">
              {!isHidden ? formatIDR(totalBalance) : '••••••••'}
            </h2>
            <button onClick={() => setIsHidden(!isHidden)} className="cursor-pointer p-1 hover:bg-white/20 rounded-lg transition-colors">
              {!isHidden ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="mt-6 flex gap-4">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-semibold">
              {accounts.length} Akun Terhubung
            </div>
          </div>
        </div>
      </motion.div>

      {/* ACCOUNT LIST SECTION */}
      <section className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Daftar Akun</h3>
          <Link to={'/dashboard/account'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              <Plus size={18} />
              Tambah
            </motion.button>
          </Link>
        </div>

        <div className="p-2">
          {/* 2. EMPTY STATE LOGIC */}
          {accounts.length === 0 ? (
            <div className="py-12 px-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                <Wallet2 size={32} />
              </div>
              <h4 className="text-slate-900 font-bold">Belum Ada Akun</h4>
            </div>
          ) : (
            accounts.map((item: any, index: number) => {
              const config = ACCOUNT_MAPPER[item.ms_account_code] || ACCOUNT_MAPPER['default'];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-4 flex items-center justify-between rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${config.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      {config.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {item.ms_account_name}
                      </h4>
                      <p className="text-xs font-medium text-slate-400 uppercase">
                        {item.ms_account_code}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-900">
                      {!isHidden ? formatIDR(item.amount) : '••••••••'}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}