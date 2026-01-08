import { Download } from "lucide-react";
import { useState } from "react";

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("Januari 2026");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Laporan Transaksi</h2>
          <p className="text-slate-500">Analisis riwayat keuanganmu secara detail.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Januari 2026</option>
            <option>Desember 2025</option>
            <option>November 2025</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-sm">
            <Download size={18} /> Excel
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
                <th className="px-6 py-4 font-bold">Tanggal</th>
                <th className="px-6 py-4 font-bold">Kategori</th>
                <th className="px-6 py-4 font-bold">Akun</th>
                <th className="px-6 py-4 font-bold">Catatan</th>
                <th className="px-6 py-4 font-bold text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">08 Jan 2026</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">Makanan</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">BCA</td>
                  <td className="px-6 py-4 text-sm text-slate-500 italic">Makan sate padang</td>
                  <td className="px-6 py-4 text-right font-bold text-red-500">- Rp 45.000</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}