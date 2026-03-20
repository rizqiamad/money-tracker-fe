import { motion } from "framer-motion";
import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  TrendingUp, TrendingDown, ArrowRightLeft, Wallet,
  ArrowUpRight, ArrowDownRight, CalendarDays, ChevronRight
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────────────────────────

const cashflowData = [
  { month: "Agu", income: 5200000, expense: 2800000 },
  { month: "Sep", income: 4800000, expense: 3100000 },
  { month: "Okt", income: 6100000, expense: 2600000 },
  { month: "Nov", income: 5500000, expense: 3400000 },
  { month: "Des", income: 7200000, expense: 4100000 },
  { month: "Jan", income: 4200000, expense: 1850000 },
];

const expenseBreakdown = [
  { name: "Makanan", value: 620000, color: "#f97316" },
  { name: "Tagihan", value: 450000, color: "#3b82f6" },
  { name: "Transport", value: 280000, color: "#8b5cf6" },
  { name: "Hiburan", value: 310000, color: "#ec4899" },
  { name: "Lainnya", value: 190000, color: "#14b8a6" },
];

const recentTransactions = [
  { id: 1, name: "Pembayaran Listrik", category: "Tagihan", date: "22 Jan 2026", amount: -250000, icon: "⚡" },
  { id: 2, name: "Gaji Januari", category: "Pemasukan", date: "20 Jan 2026", amount: 4200000, icon: "💰" },
  { id: 3, name: "Makan Siang", category: "Makanan", date: "19 Jan 2026", amount: -45000, icon: "🍜" },
  { id: 4, name: "Netflix", category: "Hiburan", date: "18 Jan 2026", amount: -54000, icon: "🎬" },
  { id: 5, name: "Transfer ke Tabungan", category: "Transfer", date: "17 Jan 2026", amount: -500000, icon: "🏦" },
];

const savingsGoals = [
  { name: "Dana Darurat", current: 8500000, target: 15000000, color: "#3b82f6" },
  { name: "Liburan Bali", current: 2300000, target: 5000000, color: "#f97316" },
  { name: "Laptop Baru", current: 4100000, target: 6000000, color: "#8b5cf6" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.abs(n));

const fmtShort = (n: number) => {
  if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}jt`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)}rb`;
  return String(n);
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, trend, trendVal, color, delay }: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; trend: "up" | "down" | "neutral";
  trendVal: string; color: string; delay: number;
}) {
  const trendColor = trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-400" : "text-slate-400";
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trendColor}`}>
          {trend !== "neutral" && <TrendIcon size={12} />}
          {trendVal}
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-black text-slate-800 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-600 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name === "income" ? "Pemasukan" : "Pengeluaran"}:</span>
          <span className="font-bold text-slate-700">{fmtShort(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const totalExpense = expenseBreakdown.reduce((s, e) => s + e.value, 0);

  return (
    <div className="space-y-6">

      {/* ── Greeting ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Selamat datang 👋</h2>
        <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-1.5">
          <CalendarDays size={13} />
          Ringkasan keuanganmu per Januari 2026
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Saldo" value="Rp 12,5jt" icon={Wallet}
          trend="up" trendVal="+8.2%" color="bg-blue-500" delay={0} />
        <StatCard label="Pemasukan" value="Rp 4,2jt" sub="Bulan ini" icon={TrendingUp}
          trend="down" trendVal="-13%" color="bg-emerald-500" delay={0.07} />
        <StatCard label="Pengeluaran" value="Rp 1,85jt" sub="Bulan ini" icon={TrendingDown}
          trend="up" trendVal="+5%" color="bg-red-400" delay={0.14} />
        <StatCard label="Transfer" value="Rp 500rb" sub="Bulan ini" icon={ArrowRightLeft}
          trend="neutral" trendVal="Tetap" color="bg-violet-500" delay={0.21} />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Cashflow Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Arus Kas</h3>
              <p className="text-xs text-slate-400">6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />Pemasukan</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400" />Pengeluaran</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cashflowData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} fill="url(#incomeGrad)" dot={false} />
              <Area type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} fill="url(#expenseGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
        >
          <h3 className="font-bold text-slate-800 text-sm mb-1">Kategori Pengeluaran</h3>
          <p className="text-xs text-slate-400 mb-4">Bulan ini</p>

          <div className="flex justify-center">
            <PieChart width={140} height={140}>
              <Pie
                data={expenseBreakdown} cx={65} cy={65}
                innerRadius={42} outerRadius={65}
                dataKey="value" paddingAngle={3}
                onMouseEnter={(_, i) => setActiveSegment(i)}
                onMouseLeave={() => setActiveSegment(null)}
              >
                {expenseBreakdown.map((e, i) => (
                  <Cell key={i} fill={e.color} opacity={activeSegment === null || activeSegment === i ? 1 : 0.4} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="space-y-2 mt-2">
            {expenseBreakdown.map((e, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
                  <span className="text-slate-600">{e.name}</span>
                </div>
                <span className="font-bold text-slate-700">{Math.round(e.value / totalExpense * 100)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Transaksi Terakhir</h3>
              <p className="text-xs text-slate-400">5 transaksi terbaru</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-blue-500 font-semibold hover:text-blue-600 transition">
              Lihat semua <ChevronRight size={13} />
            </button>
          </div>

          <div className="space-y-1">
            {recentTransactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 + i * 0.06 }}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-base shrink-0">
                    {tx.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 leading-tight">{tx.name}</p>
                    <p className="text-xs text-slate-400">{tx.date} · {tx.category}</p>
                  </div>
                </div>
                <p className={`text-sm font-black tabular-nums ${tx.amount > 0 ? "text-emerald-500" : "text-slate-700"}`}>
                  {tx.amount > 0 ? "+" : "-"}{fmt(tx.amount)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Savings Goals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.49 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Target Tabungan</h3>
              <p className="text-xs text-slate-400">Progress saat ini</p>
            </div>
          </div>

          <div className="space-y-5">
            {savingsGoals.map((goal, i) => {
              const pct = Math.round(goal.current / goal.target * 100);
              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.49 + i * 0.08 }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">{goal.name}</p>
                    <p className="text-xs font-bold text-slate-500">{pct}%</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: goal.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-slate-400">{fmt(goal.current)}</p>
                    <p className="text-xs text-slate-400">dari {fmt(goal.target)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Monthly Bar Chart */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Pengeluaran per Bulan</p>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={cashflowData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barSize={14}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow">
                        <p className="font-bold text-slate-600">{label}</p>
                        <p className="text-red-400 font-bold">{fmtShort(payload[0].value as number)}</p>
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="expense" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}