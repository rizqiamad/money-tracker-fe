import type { IListRecord } from "../../types/record";
import { motion } from "framer-motion";
import TypeBadge from "./TypeBadge";
import AccountDisplay from "./AccountDisplay";
import AmountDisplay from "./AmountDisplay";
import { formatDate } from "../../helpers/format";

export default function MobileCard({ tx, index }: { tx: IListRecord; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.04 }}
      className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
      key={index}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={tx.type} />
            {tx.sub_category_name && (
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {tx.sub_category_name}
              </span>
            )}
          </div>
          <AccountDisplay tx={tx} />
          {tx.description && (
            <p className="text-xs text-slate-400 italic truncate">{tx.description}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <AmountDisplay type={tx.type} amount={tx.amount} />
          <span className="text-[11px] text-slate-400 whitespace-nowrap">{formatDate(tx.date_action)}</span>
        </div>
      </div>
    </motion.div>
  );

}