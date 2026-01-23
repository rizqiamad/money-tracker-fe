import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Wallet, ArrowDownCircle, LogOut, User, BookmarkPlus, MessageSquare, ChevronDown } from "lucide-react";
import { api } from "../helpers/axios";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../helpers/query";
import useUserStore from "../store/user";
import { useState } from "react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return api.post("/ms_user/logout")
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['profile_guard_layout'] })
      navigate('/login', { replace: true })
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Account", path: "/dashboard/account", icon: <BookmarkPlus /> },
    { name: "Transaction", path: "/dashboard/transactions", icon: <Wallet size={20} /> },
    { name: "Reports", path: "/dashboard/reports", icon: <ArrowDownCircle size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Guardana</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}>
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button disabled={isPending} onClick={() => mutate()} className="cursor-pointer flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 relative">
          <h1 className="text-sm font-medium text-slate-500">
            Selamat pagi, <span className="text-slate-900 font-bold">{user.username}!</span>
          </h1>

          <div className="relative">
            {/* TRIGGER BUTTON */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <User size={18} />
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            {isDropdownOpen && (
              <>
                {/* Overlay untuk menutup dropdown saat klik di luar */}
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>

                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-20">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu Akun</p>
                  </div>

                  {/* Menu: Profile */}
                  <button onClick={() => navigate('/profile')} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <User size={16} />
                    <span>Lihat Profil</span>
                  </button>

                  <div className="border-t border-slate-50 mt-2 pt-2">
                    <button onClick={() => mutate()} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={16} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}