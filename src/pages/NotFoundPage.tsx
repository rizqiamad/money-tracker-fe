import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h1 className="mb-8 text-[80px] md:text-[180px] font-black text-transparent bg-clip-text bg-linear-to-br from-blue-600 to-slate-400 leading-none select-none">
            404
          </h1>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl opacity-40 blur-sm" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-1/3 right-1/4 translate-x-1/2"
          >
            <div className="w-12 h-12 bg-slate-200 rounded-full opacity-30 blur-sm" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4 -mt-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-slate-500 text-md md:text-xl max-w-md mx-auto">
            Sepertinya halaman yang kamu cari sudah dipindahkan atau tidak pernah ada.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
          >
            <Home size={20} />
            Kembali ke Beranda
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl shadow-md border border-slate-200 transition-all"
          >
            <ArrowLeft size={20} />
            Halaman Sebelumnya
          </motion.button>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600">
            <Search size={16} />
            <span>Coba cari apa yang kamu butuhkan</span>
          </div>
        </motion.div>

        {/* Decorative Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex justify-center gap-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
              className="w-2 h-2 bg-blue-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}