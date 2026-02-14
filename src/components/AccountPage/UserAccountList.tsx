import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { IUserAccount } from "../../types/userAccount";
import { api } from "../../helpers/axios";
import { formatIDR } from "../../helpers/format";
import UserAccountSkeleton from "./UserAccountSkeleton";
import EmptyState from "../EmptyState";
import { Trash2, Wallet2 } from "lucide-react";
import ActionModal from "../ActionModal";
import { useState } from "react";
import { queryClient } from "../../helpers/query";
import { toast } from "react-toastify";

const fetchUserAccount = async () => {
  const { data } = await api.post('/user_account/list')
  const userAccountData = data?.data as IUserAccount[]
  return userAccountData || []
}

export default function UserAccountList() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, data: any }>({ isOpen: false, data: null });
  const { data: userAccounts, isLoading } = useQuery({
    queryKey: ['user_account', 'list'],
    queryFn: fetchUserAccount,
    refetchOnWindowFocus: false,
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (id) => api.delete(`/user_account/delete/${id}`),
    onSuccess: () => {
      setModalConfig({ data: null, isOpen: false })
      queryClient.invalidateQueries({ queryKey: ['user_account'], refetchType: 'all' })
      toast.success('your account deleted succesfully')
    },
    onError: (err) => {
      console.log(err)
    }
  })

  if (isLoading) return <UserAccountSkeleton />;

  if (!userAccounts || !userAccounts.length) return <EmptyState icon={Wallet2} />

  const handleDeleteClick = (item: any) => {
    setModalConfig({
      isOpen: true,
      data: item,
    });
  };

  const handleConfirmDelete = () => {
    const item = modalConfig.data;
    mutateDelete(item.id)
  };

  return (
    <>
      {/* Grid User Accounts Kamu */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userAccounts && userAccounts.map((item, idx) => (
          /* Gunakan satu div utama saja sebagai wrapper card */
          <div
            key={item.id || idx} // Gunakan ID unik jika ada, jika tidak idx
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-md"
          >
            {/* Garis aksen biru di samping */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-700" />

            {/* Tombol Delete - Sekarang di dalam relative parent yang benar */}
            <button
              onClick={() => handleDeleteClick(item)}
              className="cursor-pointer absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all z-10"
            >
              <Trash2 size={18} />
            </button>

            {/* Konten teks */}
            <div className="pr-8"> {/* Padding kanan supaya teks tidak nabrak tombol hapus */}
              <p className="text-sm text-slate-500 font-medium">
                {item.ms_account_name}
              </p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">
                {formatIDR(item.amount)}
              </h3>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Komponen Modal Reusable */}
      <ActionModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ data: null, isOpen: false })}
        onConfirm={handleConfirmDelete}
        variant="danger"
        title="Hapus Akun?"
        description={`Apakah kamu yakin ingin menghapus ${modalConfig.data?.ms_account_name}? Data yang dihapus tidak bisa dikembalikan.`}
        confirmLabel="Ya, Hapus"
      />
    </>
  )
}