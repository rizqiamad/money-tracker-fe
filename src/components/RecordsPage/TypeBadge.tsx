import { ArrowRightLeft, TrendingDown, TrendingUp } from "lucide-react";
import type { RecordType } from "../../types/record";

export default function TypeBadge({ type }: { type: RecordType }) {
  const config = {
    expense: { label: "Pengeluaran", icon: TrendingDown, bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    income: { label: "Pemasukan", icon: TrendingUp, bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
    transfer: { label: "Transfer", icon: ArrowRightLeft, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  };
  const { label, icon: Icon, bg, text, border } = config[type];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${bg} ${text} ${border}`}>
      <Icon size={11} strokeWidth={2.5} />
      {label}
    </span>
  );
};