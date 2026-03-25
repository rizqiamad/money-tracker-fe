import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, PenLine, Calendar, Plus, Wallet, Tag, ChevronRight, Minus } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/axios";
import type { IUserAccount } from "../types/userAccount";
import { formatAngka, formatDateOnly, formatIDR } from "../helpers/format";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { IMsCategory } from "../types/msCategory";
import type { ISubCategory } from "../types/subCategory";
import type { IRecord } from "../types/record";
import { toast } from "react-toastify";

const fetcUserAccounts = async () => {
  const { data } = await api.post('/user_account/list')
  return (data?.data as IUserAccount[]).map((item) => ({ value: item.id, label: `${item.ms_account_code.toUpperCase()} (${formatIDR(item.amount)})` })) || []
}
const fetchCategories = async () => {
  const { data } = await api.post('/ms_category/list')
  return (data?.data as IMsCategory[]).map((item) => ({ value: item.ms_category_code, label: item.ms_category_name })) || []
};
const fetchSubCategories = async ({ ms_category_code }: { ms_category_code: string }) => {
  const { data } = await api.post('/sub_category/list', { ms_category_code })
  return (data?.data as ISubCategory[]).map((item) => ({ value: item.sub_category_code, label: item.sub_category_name })) || []
};
const fetchRecord = async (reqBody: IRecord) => {
  const { data } = await api.post('/record/create', reqBody)
  return data
};

export default function InputTransactionPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const datePickerRef = useRef<any>(null);

  const [mainMode, setMainMode] = useState<"record" | "transfer">("record");
  const [subMode, setSubMode] = useState<"expense" | "income">("expense");
  const [date, setDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [targetAccount, setTargetAccount] = useState<any>(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [availableSubCategories, setAvailableSubCategories] = useState<any[]>([]);

  const { data: accounts } = useQuery({ queryKey: ['user_account', 'list'], queryFn: fetcUserAccounts, refetchOnWindowFocus: false });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories, refetchOnWindowFocus: false });

  const { mutate: subCategoriesMutate } = useMutation({
    mutationFn: fetchSubCategories,
    onSuccess: (data) => setAvailableSubCategories(data || []),
    onError: (err) => console.log(err)
  })

  const { mutate: recordMutate, isPending: recordMutatePending } = useMutation({
    mutationFn: fetchRecord,
    onSuccess: (data) => {
      toast.success(data.message)
      setAmount(""); setSelectedAccount(null); setTargetAccount(null);
      setSelectedMainCategory(null); setAvailableSubCategories([]);
      setDate(null); setNote("")
      queryClient.invalidateQueries({ queryKey: ['user_account'] })
    },
    onError: (err) => console.log(err)
  })

  const handleMainCategoryChange = (selected: any) => {
    setSelectedMainCategory(selected);
    setSelectedSubCategory(null);
    if (selected) subCategoriesMutate({ ms_category_code: selected.value })
    else setAvailableSubCategories([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, "");
    if (!isNaN(Number(raw)) || raw === "") setAmount(raw)
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let type: string = subMode
    if (mainMode !== 'transfer') {
      if (!date || !subMode || !amount || !selectedMainCategory || !selectedSubCategory || !selectedAccount) {
        toast.error('fullfill required form'); return
      }
    } else {
      type = 'transfer'
      if (selectedAccount?.value === targetAccount?.value) { toast.error('source dan target akun tidak bisa sama'); return }
      if (!date || !amount || !selectedAccount || !targetAccount) { toast.error('fullfill required form'); return }
    }
    recordMutate({
      amount: Number(amount),
      date_action: formatDateOnly(date),
      from_user_account_id: selectedAccount.value,
      to_user_account_id: targetAccount?.value,
      description: note,
      sub_category_code: selectedSubCategory?.value,
      type,
    })
  }

  // ── Derived theme tokens ───────────────────────────────────────────────────
  const isTransfer = mainMode === "transfer";
  const isExpense = !isTransfer && subMode === "expense";
  // const isIncome   = !isTransfer && subMode === "income";

  // Hero card gradient & text
  const heroBg = isTransfer
    ? "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600"
    : isExpense
      ? "bg-gradient-to-br from-rose-500 to-red-600 border-rose-400"
      : "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400";

  // Submit button
  const submitBg = isTransfer
    ? "bg-slate-800 hover:bg-slate-900 shadow-slate-800/20"
    : isExpense
      ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25"
      : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25";

  // Sub-mode pill styles
  const pillExpense = subMode === "expense"
    ? "bg-white/20 border-white/30 text-white"
    : "bg-transparent border-white/15 text-white/45 hover:text-white/70 hover:bg-white/10";
  const pillIncome = subMode === "income"
    ? "bg-white/20 border-white/30 text-white"
    : "bg-transparent border-white/15 text-white/45 hover:text-white/70 hover:bg-white/10";

  // Icon accent for detail rows
  const iconAccent = isTransfer
    ? "bg-slate-100 border-slate-200 text-slate-400"
    : isExpense
      ? "bg-rose-50 border-rose-100 text-rose-400"
      : "bg-emerald-50 border-emerald-100 text-emerald-500";

  // Label accent
  const labelColor = isTransfer
    ? "text-slate-400"
    : isExpense
      ? "text-rose-400"
      : "text-emerald-500";

  // Select styles — consistent with rest of app but accent-colored focus
  const focusColor = isTransfer ? "#64748b" : isExpense ? "#f43f5e" : "#10b981";
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      padding: "2px 4px",
      borderRadius: "0.75rem",
      borderColor: state.isFocused ? focusColor : "#e2e8f0",
      boxShadow: state.isFocused ? `0 0 0 2px ${focusColor}25` : "none",
      backgroundColor: "#f8fafc",
      "&:hover": { borderColor: "#cbd5e1" },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#eff6ff" : state.isFocused ? "#f1f5f9" : "white",
      color: state.isSelected ? "#2563eb" : "#1e293b",
      cursor: "pointer", fontSize: "0.875rem",
    }),
    singleValue: (base: any) => ({ ...base, fontSize: "0.875rem", color: "#1e293b" }),
    placeholder: (base: any) => ({ ...base, fontSize: "0.875rem", color: "#94a3b8" }),
    input: (base: any) => ({ ...base, "input:focus": { boxShadow: "none" } }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Input Transaksi</h2>
          <p className="text-slate-500 text-sm mt-1">Catat arus kasmu dengan rapi.</p>
        </div>

        <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit">
          {[
            { id: "record", icon: PenLine, label: "Catat" },
            { id: "transfer", icon: ArrowRightLeft, label: "Transfer" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => { setMainMode(m.id as any); setAmount(""); setNote(""); setSelectedMainCategory(null); }}
              className={`cursor-pointer flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${mainMode === m.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <m.icon size={15} strokeWidth={2.5} /> {m.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Amount Hero ── */}
        <motion.div layout className={`rounded-2xl border p-6 transition-colors duration-300 ${heroBg}`}>
          <AnimatePresence mode="wait">
            {mainMode === "record" && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 mb-5">
                {[
                  { id: "expense", label: "Pengeluaran", icon: Minus },
                  { id: "income", label: "Pemasukan", icon: Plus },
                ].map((t) => (
                  <button key={t.id} type="button" onClick={() => setSubMode(t.id as any)}
                    className={`cursor-pointer flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${t.id === "expense" ? pillExpense : pillIncome
                      }`}
                  >
                    <t.icon size={11} strokeWidth={3} /> {t.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs font-bold uppercase tracking-widest mb-1 text-white/60">
            {isTransfer ? "Jumlah Transfer" : "Nominal"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white/70">Rp</span>
            <input
              type="text"
              value={formatAngka(amount)}
              onChange={handleInputChange}
              placeholder="0"
              className="flex-1 text-4xl font-black bg-transparent outline-none tabular-nums text-white placeholder:text-white/25"
            />
          </div>
        </motion.div>

        {/* ── Detail Rows ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">

          {/* Date */}
          <div className="flex items-center gap-4 px-5 py-4">
            <div className={`p-2 rounded-xl border shrink-0 ${iconAccent}`}>
              <Calendar size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${labelColor}`}>Tanggal</p>
              <DatePicker
                ref={datePickerRef}
                selected={date}
                onChange={(d: any) => setDate(d)}
                dateFormat="dd MMMM yyyy"
                wrapperClassName="w-full"
                className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300 cursor-pointer"
                placeholderText="Pilih tanggal transaksi..."
                showMonthDropdown showYearDropdown dropdownMode="select"
                required shouldCloseOnSelect
                onClickOutside={() => datePickerRef.current?.setOpen(false)}
              >
                <div className="flex gap-2 p-2 border-t border-slate-100">
                  <button type="button" onClick={() => { setDate(new Date()); datePickerRef.current?.setOpen(false); }}
                    className="cursor-pointer flex-1 text-[10px] uppercase tracking-wider font-bold bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >Hari Ini</button>
                  <button type="button" onClick={() => { setDate(null); datePickerRef.current?.setOpen(false); }}
                    className="cursor-pointer flex-1 text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                  >Reset</button>
                </div>
              </DatePicker>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mainMode === "record" ? (
              <motion.div key="record" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Account */}
                <div className="flex items-start gap-4 px-5 py-4">
                  <div className={`p-2 rounded-xl border shrink-0 mt-1 ${iconAccent}`}>
                    <Wallet size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>Akun</p>
                    <CreatableSelect
                      placeholder="Pilih akun..."
                      options={accounts} value={selectedAccount} onChange={setSelectedAccount}
                      styles={selectStyles} isValidNewOption={() => false}
                      noOptionsMessage={() => (
                        <div className="flex flex-col items-center p-3 gap-2">
                          <p className="text-sm text-slate-500">Akun tidak ditemukan</p>
                          <button onClick={() => navigate("/dashboard/account")}
                            className="cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium"
                          >+ Tambah Akun Baru</button>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-start gap-4 px-5 py-4">
                  <div className={`p-2 rounded-xl border shrink-0 mt-1 ${iconAccent}`}>
                    <Tag size={15} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <p className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>Kategori</p>
                      <CreatableSelect
                        placeholder="Pilih kategori utama..."
                        options={categories} value={selectedMainCategory} onChange={handleMainCategoryChange}
                        styles={selectStyles} isClearable
                        formatCreateLabel={(v) => `Buat kategori "${v}"`}
                        noOptionsMessage={() => "Ketik untuk buat kategori baru"}
                      />
                    </div>

                    <AnimatePresence>
                      {selectedMainCategory && availableSubCategories.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <p className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${labelColor}`}>
                            <ChevronRight size={10} /> Sub Kategori
                          </p>
                          <CreatableSelect
                            placeholder="Pilih detail kategori..."
                            options={availableSubCategories} value={selectedSubCategory} onChange={setSelectedSubCategory}
                            styles={selectStyles} isClearable
                            formatCreateLabel={(v) => `Buat sub-kategori "${v}"`}
                            menuPortalTarget={document.body} menuPosition="fixed"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {selectedMainCategory && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className={`flex items-center gap-1.5 text-xs font-semibold ${isExpense ? "text-rose-500" : "text-emerald-600"
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isExpense ? "bg-rose-500" : "bg-emerald-500"}`} />
                          {selectedMainCategory.label}
                          {selectedSubCategory && <><ChevronRight size={11} className="opacity-60" />{selectedSubCategory.label}</>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="transfer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-start gap-4 px-5 py-4">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 shrink-0 mt-1">
                    <Wallet size={15} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dari Akun</p>
                      <CreatableSelect options={accounts} value={selectedAccount} onChange={setSelectedAccount} placeholder="Sumber dana..." styles={selectStyles} />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-100" />
                      <div className="p-1.5 rounded-full bg-slate-100 border border-slate-200">
                        <ArrowRightLeft size={12} className="text-slate-400" />
                      </div>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ke Akun</p>
                      <CreatableSelect options={accounts} value={targetAccount} onChange={setTargetAccount} placeholder="Tujuan..." styles={selectStyles} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Note */}
          <div className="flex items-start gap-4 px-5 py-4">
            <div className={`p-2 rounded-xl border shrink-0 mt-1 ${iconAccent}`}>
              <PenLine size={15} />
            </div>
            <div className="flex-1">
              <p className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>Catatan (Opsional)</p>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={mainMode === "record" ? "Makan siang di Warteg..." : "Pindah dana darurat..."}
                className="w-full bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-300 resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          disabled={recordMutatePending}
          className={`cursor-pointer w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 ${submitBg}`}
        >
          {recordMutatePending
            ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            : mainMode === "transfer"
              ? <><ArrowRightLeft size={16} /> Konfirmasi Transfer</>
              : <><Plus size={16} /> Simpan Transaksi</>
          }
        </motion.button>
      </form>
    </div>
  );
}