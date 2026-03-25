import { motion } from "framer-motion";
import { useState, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Wallet, CalendarDays, ChevronRight } from "lucide-react";
import { fmtShort, formatDate, formatIDR } from "../helpers/format";
import { Link } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AccountCard from "../components/DashboardPage/AccountCard";
import type { IUserAccount } from "../types/userAccount";
import { api } from "../helpers/axios";
import { useQuery } from "@tanstack/react-query";
import CustomTooltip from "../components/DashboardPage/CustomTooltip";
import type { ISummaryRecord, IListRecord, IListRecordPayload } from "../types/record";
import type { IResponse } from "../types/response";

// ── Mock Data ──────────────────────────────────────────────────────────────────

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const fetchUserAccount = async () => {
  const { data } = await api.post('/user_account/list')
  const userAccountData = data?.data as IUserAccount[]
  return userAccountData || []
}

const fetchSummary = async (query: string) => {
  const { data } = await api.get('/record/summary', {
    params: { date_action: query }
  });

  const summaryData = data?.data as ISummaryRecord;
  return summaryData || [];
}

const fetchRecord = async (payload: IListRecordPayload) => {
  const { data } = await api.post('/record/list', payload)
  return data as IResponse<IListRecord[]>
};

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const datePickerRef = useRef<any>(null);
  const [filterMonth, setFilterMonth] = useState<Date | null>(new Date());
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [allocationTab, setAllocationTab] = useState<'income' | 'expense'>('expense');

  const { data: userAccounts } = useQuery({
    queryKey: ['user_account', 'list'],
    queryFn: fetchUserAccount,
    refetchOnWindowFocus: false,
  });

  const { data: summary } = useQuery({
    queryKey: ['summary', filterMonth],
    queryFn: () => fetchSummary(filterMonth?.toISOString().split('T')[0] || ''),
    refetchOnWindowFocus: false,
  });

  const { data: recordData } = useQuery({
    queryKey: ['record', 'list'],
    queryFn: () => fetchRecord({ limit: 5, current: 1, order_by_name: 'date_action', order_by_value: 'desc' }),
    refetchOnWindowFocus: false
  })

  const totalBalance = userAccounts?.reduce((s, a) => s + a.amount, 0);

  // Dynamic Pie Data Map
  const activeSummary = allocationTab === 'income' ? summary?.income_summary : summary?.expense_summary;
  const pieData = activeSummary?.map((item, index) => ({
    name: item.ms_category_name,
    value: item.amount,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));
  const totalPieValue = pieData?.reduce((s, e) => s + e.value, 0);

  const monthName = filterMonth ? filterMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '';

  // Calculate Cashflow arrays based on days in local month
  const targetDate = filterMonth || new Date();
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cashflowData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const found = summary?.date_summary.find((d) => d.date_action === dateStr);

    return {
      date: `${day}`,
      income: found ? found.income : 0,
      expense: found ? found.expense : 0,
    };
  });

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm border border-blue-200/50">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Laporan Hari Ini
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ringkasan Keuangan</h2>
          <p className="text-slate-400 text-sm flex items-center gap-1.5 font-medium">
            <CalendarDays size={14} className="text-blue-400" />
            Terakhir diperbarui pada {formatDate(new Date().toISOString())}
          </p>
        </motion.div>
      </div>

      {/* ── Main Portfolio Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">Total Portfolio</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{formatIDR(totalBalance || 0)}</h1>
          </div>
        </div>
      </motion.div>

      {/* ── Akun & Aktivitas ── */}
      <div className="space-y-8">

        {/* Dompet & Rekening */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Wallet size={16} className="text-blue-500" /> Dompet & Rekening
            </h3>
            <button className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Link to="/dashboard/account">Kelola Akun</Link><ChevronRight size={14} />
            </button>
          </div>

          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-1 px-1">
            {userAccounts?.map((acc, i) => (
              <AccountCard key={acc.id} account={acc} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* Riwayat Aktivitas (Actual Data) */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h3 className="font-bold text-slate-800 text-sm">Riwayat Aktivitas</h3>
              <button className="cursor-pointer flex items-center gap-1 text-xs text-blue-600 font-bold hover:gap-2 transition-all">
                <Link to="/dashboard/records">Semua</Link> <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {recordData?.data?.map((tx, i) => {
                let icon = '💸';
                let colorClass = 'text-slate-800';
                let sign = '';

                if (tx.type === 'income') {
                  icon = '💰';
                  colorClass = 'text-emerald-500';
                  sign = '+';
                } else if (tx.type === 'expense') {
                  icon = '🍜';
                  colorClass = 'text-slate-800';
                  sign = '-';
                } else if (tx.type === 'transfer') {
                  icon = '🔄';
                  colorClass = 'text-blue-500';
                  sign = '';
                }

                const amountNum = Number(tx.amount) || 0;

                // Try to format date, fallback to raw string if there's an error
                let dateDisplay = tx.date_action;
                try {
                  dateDisplay = formatDate(new Date(tx.date_action).toISOString());
                } catch (e) {
                  // ignore
                }

                return (
                  <motion.div
                    key={tx.record_id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight capitalize" title={tx.ms_category_name || ''}>
                          {tx.ms_category_name || (tx.type === 'expense' ? 'Pengeluaran' : tx.type === 'income' ? 'Pemasukan' : 'Transfer')}
                        </p>
                        {tx.description && (
                          <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate max-w-[150px] sm:max-w-[200px]" title={tx.description}>
                            {tx.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase tracking-tighter text-center min-w-[50px]">
                            {tx.type === 'transfer' ? `${tx.from_user_account_code} ➔ ${tx.to_user_account_code}` : tx.from_user_account_code}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">• {dateDisplay}</span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm font-black tabular-nums ${colorClass}`}>
                      {sign}{formatIDR(amountNum)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Monthly Laporan Section ── */}
      <div className="mt-8 pt-8 border-t border-slate-200/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-800">Laporan Bulanan</h2>
            <p className="text-sm text-slate-500 font-medium">Analisis arus kas dan alokasi dana secara spesifik</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="z-[10] flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 shadow-sm hover:bg-slate-50 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              <CalendarDays size={14} className="text-slate-400" />
              <DatePicker
                ref={datePickerRef}
                selected={filterMonth}
                onChange={(date: Date | null) => { setFilterMonth(date); datePickerRef.current?.setOpen(false); }}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                shouldCloseOnSelect
                closeOnScroll
                maxDate={new Date()}
                placeholderText="Pilih Bulan"
                className="bg-transparent outline-none text-sm font-bold text-slate-600 w-[105px] cursor-pointer py-2.5"
                onClickOutside={() => datePickerRef.current?.setOpen(false)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pergerakan Saldo (Span 8) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 h-auto lg:h-[520px]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Pergerakan Saldo</h3>
                <p className="text-xs text-slate-400 font-medium">Tren bulan {monthName}</p>
              </div>
            </div>
            <div className="h-[300px] lg:h-[400px] w-full mt-2 lg:mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={fmtShort} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Alokasi Dana (Span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col h-auto min-h-[450px] lg:h-[520px]"
          >
            <div className="mb-6">
              <h3 className="font-bold text-slate-800 text-sm">Alokasi Dana</h3>
              <p className="text-xs text-slate-400 font-medium">Berdasarkan bulan {monthName}</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-slate-50 p-1 rounded-xl mb-7 overflow-hidden border border-slate-100/50">
              <button
                onClick={() => setAllocationTab('income')}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${allocationTab === 'income' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50 ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setAllocationTab('expense')}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${allocationTab === 'expense' ? 'bg-white text-rose-600 shadow-sm border border-slate-200/50 ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Pengeluaran
              </button>
            </div>

            <div className="flex justify-center relative items-center mb-6 min-h-[160px]">
              {pieData && pieData?.length > 0 ? (
                <>
                  <PieChart width={160} height={160}>
                    <Pie
                      data={pieData} cx={75} cy={75}
                      innerRadius={55} outerRadius={80}
                      dataKey="value" paddingAngle={5}
                      stroke="none"
                      onMouseEnter={(_, i) => setActiveSegment(i)}
                      onMouseLeave={() => setActiveSegment(null)}
                    >
                      {pieData?.map((e, i) => (
                        <Cell key={i} fill={e.color} opacity={activeSegment === null || activeSegment === i ? 1 : 0.45} className="outline-none transition-opacity duration-300" />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{allocationTab === 'income' ? 'Pemasukan' : 'Pengeluaran'}</p>
                    <p className="text-sm font-black text-slate-800 tracking-tighter">{fmtShort(totalPieValue || 0)}</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-slate-50 flex items-center justify-center mb-2 shadow-inner">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center px-4 leading-tight">Kosong</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1 no-scrollbar mt-2">
              {pieData && pieData?.length > 0 ? (
                pieData?.map((e, i) => (
                  <div key={i} className={`flex items-center justify-between transition-all duration-300 ${activeSegment !== null && activeSegment !== i ? 'opacity-40 grayscale-[50%]' : 'opacity-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ background: e.color }} />
                      <span className="text-xs font-bold text-slate-600">{e.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-800 tabular-nums block">{fmtShort(e.value)}</span>
                      <span className="text-[10px] font-bold text-slate-400">{Math.round((e.value / (totalPieValue || 1)) * 100) || 0}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <p className="text-xs font-medium text-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                    Belum ada data {allocationTab === 'income' ? 'pemasukan' : 'pengeluaran'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
}