import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Plus, Save } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../helpers/axios";
import UserAccountList from "../components/AccountPage/UserAccountList";
import NewUserAccount from "../components/AccountPage/NewUserAccount";
import type { IMsAccount } from "../types/msAccount";
import { toast } from "react-toastify";
import { queryClient } from "../helpers/query";

export interface INewUserAccount {
  ms_account_code?: string
  amount: number
}

const fetcUserAccounts = async () => {
  const { data } = await api.post('/ms_account/list')
  const accountData = (data?.data as IMsAccount[]).map((item) => ({ value: item.ms_account_code, label: item.ms_account_name }))
  return accountData || []
}

export default function AccountsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [newAccounts, setNewAccounts] = useState<INewUserAccount[]>([
    { ms_account_code: undefined, amount: 0 }
  ]);
  const { mutate: bulkCreate } = useMutation({
    mutationFn: (reqBody: INewUserAccount[]) => api.post('/user_account/bulk_create', reqBody),
    onSuccess: () => {
      setIsAdding(false)
      setNewAccounts([{ ms_account_code: undefined, amount: 0 }])
      queryClient.invalidateQueries({ queryKey: ['user_account'], refetchType: 'all' })
      toast.success('your accounts created succesfully')
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const handleSubmit = () => {
    for (let i = 0; i < newAccounts.length; i++) {
      if (!newAccounts[i].ms_account_code) {
        toast.error("please fulfill yang bank information")
        return
      }
    }
    bulkCreate(newAccounts)
  }

  const addRow = () => {
    setNewAccounts([...newAccounts, { ms_account_code: "bca", amount: 0 }]);
  };

  const removeRow = (id: number) => {
    if (newAccounts.length > 1) {
      setNewAccounts(newAccounts.filter((_, idx) => idx !== id));
    }
  };

  const { data: msAccounts } = useQuery({
    queryKey: ['ms_account_list'],
    queryFn: fetcUserAccounts,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Akun Saya</h2>
          <p className="text-sm text-slate-500">Kelola semua rekening dan dompet digitalmu.</p>
        </div>

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <Plus size={18} /> Tambah Akun
          </button>
        ) : (
          <button
            onClick={() => setIsAdding(false)}
            className="cursor-pointer text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            Batal
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-4xl border border-slate-200 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Tambah Akun</h3>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {newAccounts.map((_, idx) => (
                  <NewUserAccount setNewAccounts={setNewAccounts} newAccounts={newAccounts} idx={idx} key={idx} options={msAccounts} removeRow={removeRow} />
                ))}
              </AnimatePresence>

              <button
                onClick={addRow}
                className="cursor-pointer w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Tambah Baris Baru
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button onClick={handleSubmit} className="cursor-pointer flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                <Save size={18} /> Simpan Semua Akun
              </button>
            </div>
          </motion.div>
        ) : (
          <UserAccountList />
        )}
      </AnimatePresence>
    </div>
  );
}