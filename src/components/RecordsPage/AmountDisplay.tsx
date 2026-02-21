import { formatIDR } from "../../helpers/format";
import type { RecordType } from "../../types/record";

export default function AmountDisplay({ type, amount }: { type: RecordType; amount: number }) {
  if (type === "transfer") return <span className="font-bold text-blue-600 tabular-nums">{formatIDR(amount)}</span>;
  if (type === "income") return <span className="font-bold text-green-600 tabular-nums">+ {formatIDR(amount)}</span>;
  return <span className="font-bold text-red-500 tabular-nums">- {formatIDR(amount)}</span>;
};