import {
  Download, TrendingUp, TrendingDown, ArrowRightLeft,
  Search, SlidersHorizontal, ChevronDown, Receipt
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, formatIDR } from "../helpers/format";
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

const fetchRecord = async (payload: IListRecordPayload) => {
  const { data } = await api.post('/record/list', payload)
  return data as IResponse<IListRecord[]>
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filterType, setFilterType] = useState<RecordType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const { data: recordData } = useQuery({
    queryKey: ['record', 'list', perPage, currentPage],
    queryFn: () => fetchRecord({ limit: perPage, current: currentPage, type: filterType != 'all' ? filterType : undefined }),
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

  // const handleExport = () => {
  //   const header = ["Tanggal", "Tipe", "Kategori", "Akun", "Ke Akun", "Catatan", "Jumlah"];
  //   const rows = filtered.map(tx => [tx.date_action, tx.type, tx.sub_category_name ?? "-", tx.from_user_account_name ?? "-", tx.to_user_account_name ?? "-", tx.description, tx.amount]);
  //   const csv = [header, ...rows].map(r => r.join(",")).join("\n");
  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url; a.download = `laporan_${selectedMonth}.csv`; a.click();
  //   URL.revokeObjectURL(url);
  // };

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
            selected={selectedMonth}
            onChange={(date: any) => date && setSelectedMonth(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
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
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
            />
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
              <div className="flex flex-wrap gap-2 pt-1">
                {filterTabs.map((tab) => (
                  <button key={tab.id} onClick={() => handleFilterChange(tab.id)}
                    className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${filterType === tab.id ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
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
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
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
                      key={tx.id}
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{formatDate(tx.date_action)}</td>
                      <td className="px-5 py-4"><TypeBadge type={tx.type} /></td>
                      <td className="px-5 py-4">
                        {tx.sub_category_name
                          ? <span className="text-sm font-medium text-slate-700">{tx.sub_category_name}</span>
                          : <span className="text-sm text-slate-300">—</span>}
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
                {recordData?.data.map((tx, i) => <MobileCard key={tx.id} tx={tx} index={i} />)}
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