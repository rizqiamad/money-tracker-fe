import { Outlet, Link, useLocation, Navigate, useNavigate } from "react-router";
import { LayoutDashboard, Wallet, ArrowDownCircle, LogOut, User, BookmarkPlus } from "lucide-react";
import Loading from "../components/Loading";
import { api } from "../helpers/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../helpers/query";
import useUserStore from "../store/user";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser)
  const username = useUserStore((state) => state.username)
  const { isLoading, error, data } = useQuery({
    queryKey: ['verify_cookie_dashboard_layout'],
    queryFn: () => {
      return api.get("/ms_user/verify_cookie")
    },
    staleTime: 1000 * 60 * 10,
    retry: false
  })

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return api.post("/ms_user/logout")
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['verify_cookie_dashboard_layout'] })
      navigate('/login', { replace: true })
    },
    onError: (err) => {
      console.log(err)
    }
  })

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Navigate to={"/login"} replace />
  }

  if (data) {
    const { id, email, username } = data.data.data
    setUser({ id, email, username })
  }

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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-sm font-medium text-slate-500">Selamat pagi, <span className="text-slate-900 font-bold">{username}!</span></h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
              <User size={18} />
            </div>
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