import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import Select from 'react-select'
import Input from "../Input";
import { useState } from "react";

interface IProps {
  options: { value: string, lable: string }[]
  removeRow: (id: number) => void
  newAccounts: { ms_account_code: string, amount: number }[]
}

export default function NewUserAccount({ options, removeRow, newAccounts }: IProps) {
  const [selectedOption, setSelectedOption] = useState<{ value: string, lable: string } | null>(null);
  return (
    <AnimatePresence>
      {newAccounts.map((acc, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex flex-col md:flex-row items-end gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100"
        >
          <div className="w-full md:w-1/3">
            <label className="block mb-1.5 text-sm font-semibold text-slate-700">Nama Bank/App</label>
            <Select
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              isClearable
            />
          </div>

          <div className="w-full md:w-1/2">
            {/* Gunakan komponen Input currency yang kita buat sebelumnya */}
            <Input label="Saldo Awal" type="currency" placeholder="Rp 0" />
          </div>

          <button
            onClick={() => removeRow(idx)}
            className="cursor-pointer p-3.5 text-red-500 hover:bg-red-50 rounded-xl transition"
          >
            <Trash2 size={20} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}