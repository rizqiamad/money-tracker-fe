import { formatIDR } from "../../helpers/format";

export default function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 min-w-[150px]">
        <p className="text-xs font-bold text-slate-500 mb-3 border-b border-slate-100 pb-2">Tanggal {label}</p>
        <div className="space-y-2.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ background: entry.color }} />
                {entry.dataKey === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </span>
              <span className="text-xs font-black tabular-nums" style={{ color: entry.color }}>
                {formatIDR(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};