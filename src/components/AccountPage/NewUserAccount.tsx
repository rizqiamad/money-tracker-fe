import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Select from 'react-select';
import { useEffect, useState } from "react";
import type { INewUserAccount } from "../../pages/AccountPage";

interface IProps {
  idx: number,
  setNewAccounts: (val: INewUserAccount[]) => void
  newAccounts: INewUserAccount[]
  options: { value: string, label: string }[]
  removeRow: (id: number) => void
}

export default function NewUserAccount({ options, setNewAccounts, newAccounts, removeRow, idx }: IProps) {
  const [selectedOption, setSelectedOption] = useState<{ value: string, label: string } | null>(null);
  const [amounts, setAmounts] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    newAccounts[idx].ms_account_code = selectedOption?.value
    newAccounts[idx].amount = Number(amounts[idx])
    const newData = [...newAccounts]
    setNewAccounts(newData)
  }, [selectedOption, amounts])

  // Fungsi helper untuk format titik (ribuan)
  const formatRupiah = (value: string) => {
    if (!value) return "";
    const numberString = value.replace(/[^,\d]/g, ""); // Bersihkan karakter non-angka
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Tambah titik tiap 3 angka
  };

  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, ""); // Hapus titik untuk simpan angka mentah
    if (!isNaN(Number(rawValue)) || rawValue === "") {
      setAmounts(prev => ({ ...prev, [idx]: rawValue }));
    }
  };

  return (
    <motion.div
      key={idx}
      className="flex flex-col md:flex-row justify-center items-end gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all mb-3"
    >
      {/* Select Bank */}
      <div className="w-full md:w-2/5">
        <label className="block mb-1.5 text-xs font-bold text-slate-500 uppercase">Nama Bank/App</label>
        <Select
          options={options}
          onChange={(val: any) => setSelectedOption(val)}
          isClearable
          placeholder="Pilih..."
          styles={{
            control: (base, state) => ({
              ...base,
              borderRadius: '12px',
              borderWidth: '2px',
              borderColor: state.isFocused ? '#6366f1' : '#f1f5f9',
              backgroundColor: '#f8fafc',
              boxShadow: 'none',
              padding: '1.5px',
            })
          }}
        />
      </div>

      {/* Input Saldo dengan Format Titik */}
      <div className="w-full md:flex-1">
        <label className="block mb-1.5 text-xs font-bold text-slate-500 uppercase">Saldo Awal</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
          <input
            type="text" // Kita pakai text agar bisa input titik
            value={formatRupiah(amounts[idx] || "")}
            onChange={(e) => handleInputChange(idx, e)}
            placeholder="0"
            className="w-full pl-11 pr-4 py-1.75 bg-slate-50 border-2 border-slate-100 rounded-xl 
                           text-slate-900 font-semibold focus:outline-none focus:border-indigo-500 
                           focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      <button
        onClick={() => removeRow(idx)}
        className="cursor-pointerp-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 size={20} />
      </button>
    </motion.div>
  );
}