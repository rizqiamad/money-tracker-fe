import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative w-16 h-16">
        {/* Ring Luar */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-full h-full border-4 border-slate-100 border-t-blue-600 rounded-full"
        />
        {/* Dot Tengah */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 m-auto w-3 h-3 bg-blue-600 rounded-full"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800">Memproses Data...</h3>
        <p className="text-sm text-slate-500">Mohon tunggu sebentar.</p>
      </div>
    </div>
  );
}