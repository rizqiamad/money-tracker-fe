import { motion } from "framer-motion";

export default function DashboardPage() {
  const stats = [
    { label: "Total Saldo", amount: "Rp 12.500.000", color: "bg-blue-600", text: "text-white" },
    { label: "Pemasukan Bulan Ini", amount: "Rp 4.200.000", color: "bg-white", text: "text-slate-800" },
    { label: "Pengeluaran Bulan Ini", amount: "Rp 1.850.000", color: "bg-white", text: "text-slate-800" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.color} p-6 rounded-2xl shadow-sm border border-slate-200`}
          >
            <p className={`text-sm font-medium ${stat.text === 'text-white' ? 'text-blue-100' : 'text-slate-500'}`}>
              {stat.label}
            </p>
            <h3 className={`text-2xl font-bold mt-1 ${stat.text}`}>{stat.amount}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions Placeholder */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Transaksi Terakhir</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full" />
                <div>
                  <p className="font-semibold text-slate-800">Pembayaran Listrik</p>
                  <p className="text-xs text-slate-500">8 Jan 2026 • Tagihan</p>
                </div>
              </div>
              <p className="font-bold text-red-500">- Rp 250.000</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}