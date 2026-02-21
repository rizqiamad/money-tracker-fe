import { ArrowRightLeft } from "lucide-react";
import type { IListRecord } from "../../types/record";

export default function AccountDisplay({ tx }: { tx: IListRecord }) {
  if (tx.type === "transfer") {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{tx.from_user_account_name?.toUpperCase()}</span>
        <ArrowRightLeft size={10} className="text-blue-400 shrink-0" />
        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{tx.to_user_account_name?.toUpperCase()}</span>
      </div>
    );
  }
  return <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{tx.from_user_account_name?.toUpperCase()}</span>;
};