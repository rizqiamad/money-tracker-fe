import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
}

export default function EmptyState({ icon: Icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100"
    >
      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={32} strokeWidth={1.5} />
      </div>

      <div className="text-center">
        <h3 className="text-sm font-bold text-slate-900">Data Not Found</h3>
        <p className="text-xs text-slate-400 mt-1">Belum ada data tersedia saat ini.</p>
      </div>
    </motion.div>
  );
}