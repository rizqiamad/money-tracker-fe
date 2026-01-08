import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CreditCard, Save } from "lucide-react";
import Input from "../components/Input";

export default function AccountsPage() {
  const [isAdding, setIsAdding] = useState(false);
  // State untuk menyimpan list akun yang akan ditambah
  const [newAccounts, setNewAccounts] = useState([
    { id: Date.now(), bankName: "BCA", balance: "" }
  ]);

  const bankOptions = ["BCA", "BNI", "Mandiri", "BRI", "GoPay", "OVO", "Dana", "Tunai"];

  const addRow = () => {
    setNewAccounts([...newAccounts, { id: Date.now(), bankName: "BCA", balance: "" }]);
  };

  const removeRow = (id: number) => {
    if (newAccounts.length > 1) {
      setNewAccounts(newAccounts.filter(acc => acc.id !== id));
    }
  };

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
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <Plus size={18} /> Tambah Akun
          </button>
        ) : (
          <button
            onClick={() => setIsAdding(false)}
            className="text-sm font-semibold text-slate-500 hover:text-slate-800"
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
              <AnimatePresence>
                {newAccounts.map((acc) => (
                  <motion.div
                    key={acc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col md:flex-row items-end gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="w-full md:w-1/3">
                      <label className="block mb-1.5 text-sm font-semibold text-slate-700">Nama Bank/App</label>
                      <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition font-medium">
                        {bankOptions.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>

                    <div className="w-full md:w-1/2">
                      {/* Gunakan komponen Input currency yang kita buat sebelumnya */}
                      <Input label="Saldo Awal" type="currency" placeholder="Rp 0" />
                    </div>

                    <button
                      onClick={() => removeRow(acc.id)}
                      className="p-3.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={addRow}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Tambah Baris Baru
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                <Save size={18} /> Simpan Semua Akun
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Tampilan List Akun yang sudah ada (Seperti desain sebelumnya) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-700" />
              <p className="text-sm text-slate-500 font-medium">BCA</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">Rp 5.000.000</h3>
              {/* <button className="mt-4 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition">Lihat Detail →</button> */}
            </div>
            {/* ... Map data akun lainnya ... */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}