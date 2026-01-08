import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../components/Input";
import { ArrowRightLeft, PenLine } from "lucide-react";

export default function InputTransactionPage() {
  const [mainMode, setMainMode] = useState("record"); // record | transfer
  const [subMode, setSubMode] = useState("expense"); // expense | income

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-xl shadow-slate-200/50">

        {/* HEADER & MAIN MODE SELECTOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Input Keuangan</h2>

          <div className="flex p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200">
            <button
              onClick={() => setMainMode("record")}
              className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${mainMode === "record" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <PenLine size={16} /> Catat
            </button>
            <button
              onClick={() => setMainMode("transfer")}
              className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${mainMode === "transfer" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <ArrowRightLeft size={16} /> Transfer
            </button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

          <AnimatePresence mode="wait">
            {mainMode === "record" ? (
              <motion.div
                key="record-fields"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* RADIO BUTTONS (EXPENSE/INCOME) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Tipe Transaksi</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="relative cursor-pointer group">
                      <input
                        type="radio" name="subMode" className="peer sr-only"
                        checked={subMode === "expense"}
                        onChange={() => setSubMode("expense")}
                      />
                      <div className="w-full py-3 px-4 text-center rounded-xl border-2 border-slate-100 text-slate-500 font-bold transition-all
                        peer-checked:border-red-400 peer-checked:bg-blue-50 peer-checked:text-red-400 group-hover:bg-slate-50">
                        Pengeluaran
                      </div>
                    </label>
                    <label className="relative cursor-pointer group">
                      <input
                        type="radio" name="subMode" className="peer sr-only"
                        checked={subMode === "income"}
                        onChange={() => setSubMode("income")}
                      />
                      <div className="w-full py-3 px-4 text-center rounded-xl border-2 border-slate-100 text-slate-500 font-bold transition-all
                        peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-600 group-hover:bg-slate-50">
                        Pemasukan
                      </div>
                    </label>
                  </div>
                </div>

                <Input label="Nominal (Rp)" type="number" placeholder="0" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">Kategori</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition">
                      <option>Makanan & Minuman</option>
                      <option>Transportasi</option>
                      <option>Hiburan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">Pilih Akun</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition">
                      <option>BCA (Saldo: Rp 5jt)</option>
                      <option>BNI (Saldo: Rp 2jt)</option>
                      <option>Tunai</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* MODE TRANSFER */
              <motion.div
                key="transfer-fields"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <Input label="Jumlah Transfer (Rp)" type="number" placeholder="0" />

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-full">
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">Dari Akun</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition">
                      <option>BCA</option>
                      <option>BNI</option>
                    </select>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-6 hidden md:block">
                    <ArrowRightLeft size={20} />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">Ke Akun</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition">
                      <option>BNI</option>
                      <option>BCA</option>
                      <option>GoPay</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Input label="Catatan (Opsional)" placeholder="Tambahkan keterangan..." />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-blue-700 transition-all mt-4"
          >
            {mainMode === "transfer" ? "Konfirmasi Transfer" : "Simpan Transaksi"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}