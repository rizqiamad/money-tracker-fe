import {
  Download, TrendingUp, TrendingDown, ArrowRightLeft,
  Search, SlidersHorizontal, ChevronDown, Receipt,
  X
} from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, formatIDR, formatDateOnly } from "../helpers/format";
import type { IListRecord, IListRecordPayload, RecordType } from "../types/record";
import AccountDisplay from "../components/RecordsPage/AccountDisplay";
import AmountDisplay from "../components/RecordsPage/AmountDisplay";
import MobileCard from "../components/RecordsPage/MobileCard";
import TypeBadge from "../components/RecordsPage/TypeBadge";
import Pagination from "../components/RecordsPage/Pagination";
import { api } from "../helpers/axios";
import { useQuery } from "@tanstack/react-query";
import type { IResponse } from "../types/response";
import DatePicker from "react-datepicker";
import { useDebounce } from 'use-debounce';

const fetchRecord = async (payload: IListRecordPayload) => {
  const { data } = await api.post('/record/list', payload)
  return data as IResponse<IListRecord[]>
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RecordsPage() {
  const datePickerRef = useRef<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const [filterType, setFilterType] = useState<RecordType | "all">("all");
  const [filterAccount, setFilterAccount] = useState<number | "all">("all");
  const [filterCategory, setFilterCategory] = useState<string | "all">("all");
  const [filterDateRange, setFilterDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = filterDateRange;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [searchQuery, setSearchQuery] = useState("");
  const [search] = useDebounce(searchQuery, 1000);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const { data: accountsList } = useQuery({
    queryKey: ['user_account', 'list'], queryFn: async () => {
      const { data } = await api.post('/user_account/list')
      return (data?.data as any[]) || []
    }, refetchOnWindowFocus: false
  });

  const { data: categoriesList } = useQuery({
    queryKey: ["categories"], queryFn: async () => {
      const { data } = await api.post('/ms_category/list')
      return (data?.data as any[]) || []
    }, refetchOnWindowFocus: false
  });

  const { data: recordData } = useQuery({
    queryKey: ['record', 'list', perPage, currentPage, filterType, search, filterAccount, filterCategory, startDate, endDate, sortOrder],
    queryFn: () => fetchRecord({
      limit: perPage,
      current: currentPage,
      search,
      type: filterType !== 'all' ? filterType : undefined,
      from_user_account_id: filterAccount !== 'all' ? filterAccount : undefined,
      ms_category_code: filterCategory !== 'all' ? filterCategory : undefined,
      start_date: startDate ? formatDateOnly(startDate) : undefined,
      end_date: endDate ? formatDateOnly(endDate) : undefined,
      order_by_name: 'date_action',
      order_by_value: sortOrder,
    }),
    refetchOnWindowFocus: false
  })

  const handleFilterChange = (type: RecordType | "all") => { setFilterType(type); setCurrentPage(1); };
  const handleSearchChange = (q: string) => { setSearchQuery(q); setCurrentPage(1); };

  const totalPages = Math.ceil((recordData?.total ?? 0) / perPage);

  const summary = useMemo(() => {
    const income = recordData?.data.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
    const expense = recordData?.data.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
    const transfer = recordData?.data.filter(t => t.type === "transfer").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
    return { income, expense, transfer, net: income - expense };
  }, [recordData]);

  const filterTabs: { id: RecordType | "all"; label: string }[] = [
    { id: "all", label: "Semua" }, { id: "expense", label: "Pengeluaran" },
    { id: "income", label: "Pemasukan" }, { id: "transfer", label: "Transfer" },
  ];

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan Transaksi</h2>
          <p className="text-slate-500 text-sm mt-1">Analisis riwayat keuanganmu secara detail.</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePicker
            ref={datePickerRef}
            rangeSeparator="-"
            selected={selectedMonth}
            onChange={(date: any) => { if (date) setSelectedMonth(date); datePickerRef.current?.setOpen(false); }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            onClickOutside={() => datePickerRef.current?.setOpen(false)}
            customInput={
              <div className="flex items-center gap-2 pl-4 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer shadow-sm hover:border-slate-300 transition">
                <span className="text-sm font-medium text-slate-700">
                  {selectedMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                </span>
                <ChevronDown size={13} className="text-slate-400" />
              </div>
            }
          />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => alert('export')}
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm shadow-emerald-500/20 text-sm whitespace-nowrap"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Pemasukan", value: summary.income, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
          { label: "Pengeluaran", value: summary.expense, icon: TrendingDown, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
          { label: "Transfer", value: summary.transfer, icon: ArrowRightLeft, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Selisih IN - EX", value: summary.net, icon: Receipt, color: summary.net >= 0 ? "text-green-600" : "text-red-500", bg: "bg-slate-50", border: "border-slate-200" },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`bg-white rounded-2xl border ${card.border} p-4 shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-tight">{card.label}</p>
              <div className={`p-1.5 rounded-xl ${card.bg} shrink-0`}>
                <card.icon size={13} className={card.color} strokeWidth={2.5} />
              </div>
            </div>
            <p className={`text-sm md:text-base font-black ${card.color} tabular-nums truncate`}>
              {formatIDR(Math.abs(card.value))}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" placeholder="Cari catatan, kategori, akun..."
              value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`cursor-pointer relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition shrink-0 ${showFilter ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filter</span>
            {filterType !== "all" && (
              <span className="absolute top-2 right-2 sm:hidden w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilter && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-4 pt-4 border-t border-slate-100 mt-4">
                {/* Types */}
                <div className="space-y-2 lg:w-1/4 min-w-[140px]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                    Tipe Transaksi
                    {filterType !== 'all' && (
                      <button type="button" onClick={() => { setFilterType('all'); setCurrentPage(1); }} className="text-blue-500 hover:text-blue-600 text-[10px] cursor-pointer bg-blue-50 px-2 py-0.5 rounded-md">Reset</button>
                    )}
                  </span>
                  <select value={filterType} onChange={(e) => handleFilterChange(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer custom-select">
                    {filterTabs.map((tab) => (
                      <option key={tab.id} value={tab.id}>{tab.label}</option>
                    ))}
                  </select>
                </div>

                {/* Extended Filters */}
                <div className="flex flex-wrap gap-3 flex-1">
                  <div className="space-y-2 flex-1 min-w-[140px]">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                      Akun
                      {filterAccount !== 'all' && (
                        <button type="button" onClick={() => { setFilterAccount('all'); setCurrentPage(1); }} className="text-blue-500 hover:text-blue-600 text-[10px] cursor-pointer bg-blue-50 px-2 py-0.5 rounded-md">Reset</button>
                      )}
                    </span>
                    <select value={filterAccount} onChange={(e) => { setFilterAccount(e.target.value === 'all' ? 'all' : Number(e.target.value)); setCurrentPage(1); }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer custom-select">
                      <option value="all">Semua Akun</option>
                      {accountsList?.map((a: any) => <option key={a.id} value={a.id}>{a.ms_account_code.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2 flex-1 min-w-[140px]">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                      Kategori
                      {filterCategory !== 'all' && (
                        <button type="button" onClick={() => { setFilterCategory('all'); setCurrentPage(1); }} className="text-blue-500 hover:text-blue-600 text-[10px] cursor-pointer bg-blue-50 px-2 py-0.5 rounded-md">Reset</button>
                      )}
                    </span>
                    <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer custom-select">
                      <option value="all">Semua Kategori Utama</option>
                      {categoriesList?.map((c: any) => <option key={c.ms_category_code} value={c.ms_category_code}>{c.ms_category_name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2 flex-1 min-w-[200px]">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                      Rentang Tanggal
                      {(startDate || endDate) && (
                        <button type="button" onClick={() => { setFilterDateRange([null, null]); setCurrentPage(1); }} className="text-blue-500 hover:text-blue-600 text-[10px] cursor-pointer bg-blue-50 px-2 py-0.5 rounded-md">Reset</button>
                      )}
                    </span>
                    <DatePicker
                      portalId="root-portal"
                      selectsRange={true}
                      startDate={startDate!}
                      endDate={endDate!}
                      onChange={(update: any) => { setFilterDateRange(update); if (update[0] && update[1]) setCurrentPage(1); }}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Pilih tanggal..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
                    />
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Table / Cards ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Tanggal", "Tipe", "Kategori", "Akun", "Catatan"].map(h => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap ${h === 'Tanggal' ? 'cursor-pointer hover:bg-slate-100 transition' : ''}`}
                    onClick={() => {
                      if (h === 'Tanggal') { setSortOrder(s => s === 'desc' ? 'asc' : 'desc'); setCurrentPage(1); }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {h}
                      {h === 'Tanggal' && (
                        <ChevronDown size={13} className={`transition-transform duration-200 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Jumlah</th>
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              {recordData?.data.length === 0 ? (
                <motion.tbody key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Receipt size={36} strokeWidth={1.5} />
                        <p className="font-medium">Tidak ada transaksi ditemukan</p>
                        <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                      </div>
                    </td>
                  </tr>
                </motion.tbody>
              ) : (
                <motion.tbody
                  key="data"
                  className="divide-y divide-slate-100"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  {recordData?.data.map((tx, i) => (
                    <motion.tr
                      key={tx.record_id}
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{formatDate(tx.date_action)}</td>
                      <td className="px-5 py-4"><TypeBadge type={tx.type} /></td>
                      <td className="px-5 py-4">
                        {tx.ms_category_name ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">{tx.ms_category_name}</span>
                            {tx.sub_category_name && <span className="text-xs text-slate-400 font-medium">{tx.sub_category_name}</span>}
                          </div>
                        ) : tx.sub_category_name ? (
                          <span className="text-sm font-medium text-slate-700">{tx.sub_category_name}</span>
                        ) : (
                          <span className="text-sm text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4"><AccountDisplay tx={tx} /></td>
                      <td className="px-5 py-4 max-w-40">
                        {tx.description
                          ? <span className="text-sm text-slate-500 italic truncate block">{tx.description}</span>
                          : <span className="text-slate-300 text-sm">—</span>}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <AmountDisplay type={tx.type} amount={tx.amount} />
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              )}
            </AnimatePresence>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden">
          {recordData?.data.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
              <Receipt size={36} strokeWidth={1.5} />
              <p className="font-medium text-sm">Tidak ada transaksi ditemukan</p>
              <p className="text-xs">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={currentPage}>
                {recordData?.data.map((tx, i) => <MobileCard key={tx.record_id} tx={tx} index={i} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {recordData && recordData?.data.length > 0 && recordData?.current && recordData?.total && (
          <Pagination
            currentPage={currentPage} totalPages={totalPages}
            totalItems={recordData?.data.length} perPage={perPage}
            onPageChange={setCurrentPage} onPerPageChange={setPerPage}
          />
        )}
      </div>
    </div>
  );
}