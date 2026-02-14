import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, PenLine, Calendar, Plus, Wallet, Tag } from "lucide-react";
import CreatableSelect from "react-select/creatable"; // Menggunakan versi Creatable
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/axios";
import type { IUserAccount } from "../types/userAccount";
import { formatAngka, formatIDR } from "../helpers/format";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const fetcUserAccounts = async () => {
  const { data } = await api.post('/user_account/list')
  const accountData = (data?.data as IUserAccount[]).map((item) => ({ value: item.ms_account_code, label: `${item.ms_account_code.toUpperCase()} (${formatIDR(item.amount)})` }))
  return accountData || []
}

const fetchCategories = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { value: "food", label: "Makanan & Minuman" },
    { value: "transport", label: "Transportasi" },
  ];
};

export default function InputTransactionPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  // State Form
  const [mainMode, setMainMode] = useState<"record" | "transfer">("record");
  const [subMode, setSubMode] = useState<"expense" | "income">("expense");
  const [date, setDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // State untuk React-Select
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [targetAccount, setTargetAccount] = useState<any>(null); // Untuk transfer

  // 1. TanStack Query: Fetch Data
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['user_account', 'list'],
    queryFn: fetcUserAccounts,
    refetchOnWindowFocus: false,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // 2. Simulasi Create Data Baru (Jika user mengetik manual di select)
  const createCategoryMutation = useMutation({
    mutationFn: async (newLabel: string) => {
      // Panggil API create category di sini
      return { value: newLabel.toLowerCase(), label: newLabel };
    },
    onSuccess: (newData) => {
      // Update cache agar langsung muncul
      queryClient.setQueryData(["categories"], (old: any) => [...old, newData]);
      setSelectedCategory(newData);
    },
  });
  useEffect(() => {
    console.log(date)
  }, [date])

  // --- CUSTOM STYLES UNTUK REACT-SELECT AGAR COCOK DENGAN TAILWIND ---
  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      padding: "4px",
      borderRadius: "0.75rem", // rounded-xl
      borderColor: state.isFocused ? "#3b82f6" : "#e2e8f0", // blue-500 : slate-200
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      backgroundColor: "#f8fafc", // slate-50
      "&:hover": { borderColor: "#cbd5e1" }, // slate-300
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#eff6ff" : state.isFocused ? "#f1f5f9" : "white",
      color: state.isSelected ? "#2563eb" : "#1e293b",
      cursor: "pointer",
    }),
    input: (base: any) => ({ ...base, "input:focus": { boxShadow: "none" } }),
  };

  const handleCreateCategory = (inputValue: string) => {
    if (!inputValue) return;
    if (confirm(`Kategori "${inputValue}" belum ada. Buat baru?`)) {
      createCategoryMutation.mutate(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, ""); // Hapus titik untuk simpan angka mentah
    if (!isNaN(Number(rawValue)) || rawValue === "") {
      setAmount(rawValue)
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">

        {/* HEADER & TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Input Transaksi</h2>
            <p className="text-slate-500 text-sm mt-1">Catat arus kasmu dengan rapi.</p>
          </div>

          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
            {[
              { id: "record", icon: PenLine, label: "Catat" },
              { id: "transfer", icon: ArrowRightLeft, label: "Transfer" }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setMainMode(mode.id as any);
                  // Reset field saat ganti mode agar bersih
                  setAmount(""); setNote(""); setSelectedCategory(null);
                }}
                className={`flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mainMode === mode.id
                  ? "bg-white text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
              >
                <mode.icon size={16} strokeWidth={2.5} /> {mode.label}
              </button>
            ))}
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

          {/* TANGGAL TRANSAKSI (Always Visible) */}
          <div className="relative w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-400">
              <Calendar size={18} />
            </div>
            <DatePicker
              selected={date}
              onChange={(date: any) => setDate(date)}
              dateFormat="dd MMMM yyyy" // Ini yang bikin tampilan rapi: 08 Feb 2026
              wrapperClassName="w-full"
              className="w-full text-center pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
              placeholderText="Pilih Tanggal"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            >
              <div className="flex gap-2 p-2 border-t border-slate-100">
                <button
                  onClick={() => setDate(new Date())}
                  className="cursor-pointer flex-1 text-[10px] uppercase tracking-wider font-bold bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => setDate(null)}
                  className="cursor-pointer flex-1 text-[10px] uppercase tracking-wider font-bold bg-white text-slate-500 border border-slate-200 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Reset
                </button>
              </div>
            </DatePicker>
          </div>

          <AnimatePresence mode="wait">
            {mainMode === "record" ? (
              <motion.div
                key="record-fields"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* PILIHAN INCOME / EXPENSE */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "expense", label: "Pengeluaran", color: "red", border: "border-red-200", bg: "bg-red-50", text: "text-red-600" },
                    { id: "income", label: "Pemasukan", color: "green", border: "border-green-200", bg: "bg-green-50", text: "text-green-600" }
                  ].map((type) => (
                    <label key={type.id} className="relative cursor-pointer group">
                      <input
                        type="radio" name="subMode" className="peer sr-only"
                        checked={subMode === type.id}
                        onChange={() => setSubMode(type.id as any)}
                      />
                      <div className={`
                        w-full py-3 px-4 text-center rounded-xl border-2 transition-all duration-200
                        ${subMode === type.id
                          ? `${type.border} ${type.bg} ${type.text} shadow-sm font-bold`
                          : "border-slate-100 text-slate-400 hover:bg-slate-50 hover:border-slate-200 font-medium"}
                      `}>
                        {type.label}
                      </div>
                    </label>
                  ))}
                </div>

                {/* NOMINAL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nominal</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Rp</span>
                    <input
                      type="text"
                      value={formatAngka(amount)}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-1.5 text-lg font-semibold placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* CATEGORY SELECT (CREATABLE) */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      <Tag size={12} /> Kategori
                    </label>
                    <CreatableSelect
                      placeholder={isLoadingCategories ? "Memuat..." : "Pilih / Buat Baru..."}
                      isLoading={isLoadingCategories}
                      options={categories}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      onCreateOption={handleCreateCategory} // Trigger saat user tekan enter di input baru
                      styles={customSelectStyles}
                      formatCreateLabel={(inputValue) => `Buat kategori "${inputValue}"?`}
                      noOptionsMessage={() => "Ketik untuk buat kategori baru"}
                      isClearable
                    />
                  </div>

                  {/* ACCOUNT SELECT */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      <Wallet size={12} /> Akun
                    </label>
                    <CreatableSelect
                      placeholder={isLoadingAccounts ? "Memuat..." : "Pilih Akun..."}
                      isLoading={isLoadingAccounts}
                      options={accounts}
                      value={selectedAccount}
                      onChange={setSelectedAccount}
                      styles={customSelectStyles}
                      isValidNewOption={() => false}
                      noOptionsMessage={() => (
                        <div className="flex flex-col items-center p-4 space-y-2">
                          <p className="text-sm text-slate-500">Akun tidak ditemukan</p>
                          <button
                            onClick={() => navigate('/dashboard/account')} // Sesuaikan path-nya
                            className="cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            + Tambah Akun Baru
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              /* MODE TRANSFER */
              <motion.div
                key="transfer-fields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Jumlah Transfer</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Rp</span>
                    <input
                      type="text"
                      value={formatAngka(amount)}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-1.5 text-lg font-semibold placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 relative">
                  <div className="w-full space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Dari Akun</label>
                    <CreatableSelect
                      options={accounts}
                      value={selectedAccount}
                      onChange={setSelectedAccount}
                      placeholder="Sumber Dana"
                      styles={customSelectStyles}
                    />
                  </div>

                  {/* Icon Panah Transfer */}
                  <div className="shrink-0 bg-blue-50 border border-blue-100 p-2 rounded-full text-blue-600 mt-6 rotate-90 md:rotate-0 shadow-sm z-10">
                    <ArrowRightLeft size={18} />
                  </div>

                  <div className="w-full space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ke Akun</label>
                    <CreatableSelect
                      options={accounts}
                      value={targetAccount}
                      onChange={setTargetAccount}
                      placeholder="Tujuan"
                      styles={customSelectStyles}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CATATAN (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Catatan</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Misal: Makan siang di Warteg..."
              className="placeholder:text-slate-400 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`
                cursor-pointer w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all mt-4 flex justify-center items-center gap-2
                ${mainMode === "transfer" ? "bg-slate-800 hover:bg-slate-900" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {mainMode === "transfer" ? <ArrowRightLeft size={18} /> : <Plus size={18} />}
            {mainMode === "transfer" ? "Konfirmasi Transfer" : "Simpan Transaksi"}
          </motion.button>

        </form>
      </div>
    </div>
  );
}