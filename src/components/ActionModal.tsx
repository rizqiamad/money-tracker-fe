import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2, OctagonAlert } from 'lucide-react';

interface IProps {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  title: string,
  description: string,
  confirmLabel?: string,
  cancelLabel?: string,
  variant: "danger" | "warning" | "success" | "info"
}

export default function ActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant
}: IProps) {

  const variants = {
    danger: {
      icon: <OctagonAlert className="w-6 h-6" />,
      color: "bg-red-100 text-red-600",
      btn: "bg-red-600 hover:bg-red-700 text-white"
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-amber-100 text-amber-600",
      btn: "bg-amber-600 hover:bg-amber-700 text-white"
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-600",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white"
    },
    info: {
      icon: <Info className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700 text-white"
    }
  };

  const style = variants[variant] || variants.info;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative z-10 overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${style.color}`}>
                {style.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-800">{title}</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                {description}
              </p>

              <div className="flex gap-3 w-full mt-8">
                <button
                  onClick={onClose}
                  className="cursor-pointer flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition-all active:scale-95"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`cursor-pointer flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all active:scale-95 shadow-sm ${style.btn}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};