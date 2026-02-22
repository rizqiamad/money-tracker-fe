import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Wallet, ArrowDownCircle, LogOut,
  User, BookmarkPlus, ChevronDown, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../helpers/axios";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../helpers/query";
import useUserStore from "../store/user";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const resetStore = useUserStore((state) => state.reset);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Otomatis tutup sidebar mobile saat pindah halaman
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post("/ms_user/logout"),
    onSuccess: () => {
      queryClient.clear();
      resetStore();
      navigate('/login', { replace: true });
    },
  });

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Account", path: "/dashboard/account", icon: <BookmarkPlus size={20} /> },
    { name: "Transaction", path: "/dashboard/transactions", icon: <Wallet size={20} /> },
    { name: "Records", path: "/dashboard/records", icon: <ArrowDownCircle size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">G</div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">Guardana</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}>
                {item.icon}
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          disabled={isPending}
          onClick={() => mutate()}
          className="cursor-pointer flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR - DESKTOP (Fixed) */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* SIDEBAR - MOBILE (Drawer with Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-5 -right-12 p-2 bg-white rounded-full text-slate-600 shadow-lg"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col lg:pl-64">

        {/* TOPBAR */}
        <header className="sticky top-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-20">
          <div className="flex items-center gap-4">
            {/* Hamburger Button Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-sm font-medium text-slate-500 hidden sm:block">
              Selamat pagi, <span className="text-slate-900 font-bold">{user.username}!</span>
            </h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-inner">
                <User size={18} />
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-20 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi Akun</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5 capitalize">{user.username}</p>
                  </div>
                  <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <User size={16} />
                    Lihat Profil
                  </button>
                  <div className="border-t border-slate-100 pt-1">
                    <button onClick={() => mutate()} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-bold">
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}