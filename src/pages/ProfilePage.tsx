import { useState } from 'react';
import { User, Mail, Phone, ShieldAlert, MessageSquare, ArrowLeft, LogOut, LayoutDashboard } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../helpers/axios';
import { queryClient } from '../helpers/query';
import { useNavigate } from 'react-router';
import useUserStore from '../store/user';
import AccountSection from '../components/ProfilePage/AccountSection';
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('umum');
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user)
  const resetStore = useUserStore((state) => state.reset)

  const { mutate } = useMutation({
    mutationFn: () => {
      return api.post("/ms_user/logout")
    },
    onSuccess: () => {
      queryClient.clear()
      resetStore()
      navigate('/login', { replace: true })
    },
    onError: (err) => {
      console.log(err)
    }
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* TOP NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Back to Dashboard */}
          <button
            onClick={() => navigate('/dashboard')} // Ganti dengan Link jika pakai react-router
            className="cursor-pointer flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Dashboard
          </button>

          {/* Logout Button */}
          <button
            className="cursor-pointer flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-all font-semibold text-sm"
            onClick={() => mutate()}
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </nav>

      {/* HEADER LAYOUT */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <User size={40} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
                <p className="text-slate-500 text-sm">Kelola informasi pribadi dan layanan Anda.</p>
              </div>
            </div>

            {/* Quick Action Dashboard Shortcut */}
            <button
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl transition-all text-sm font-bold"
            >
              <LayoutDashboard size={18} />
              Panel Utama
            </button>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex gap-8 mt-10 relative">
            {['umum', 'aktivasi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative cursor-pointer pb-4 text-sm font-bold transition-all ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <div className='flex items-center gap-1'>
                  {tab === 'umum' ? 'Informasi Umum' : 'Aktivasi WhatsApp'}
                  {tab != 'umum' && user.is_verified && user.is_verified < 2 && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                  )}
                </div>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  />
                )}
              </button>

            ))}
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {activeTab === 'umum' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Box Info Utama */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-slate-800">Detail Profil</h3>
                  <button className="cursor-pointer text-sm text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors">Edit Profil</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
                    <p className="text-slate-700 font-semibold flex items-center gap-2">
                      <User size={16} className="text-slate-300" /> {user.username}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                    <p className="text-slate-700 font-semibold flex items-center gap-2">
                      <Mail size={16} className="text-slate-300" /> {user.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Handphone</label>
                    <p className="text-slate-700 font-semibold flex items-center gap-2">
                      <Phone size={16} className="text-slate-300" /> {user.no_handphone}
                    </p>
                  </div>
                </div>
              </section>

              {/* Akun Terdaftar */}
              <AccountSection />
            </div>

            {/* Sidebar info tambahan */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-2">Bantuan</h4>
                <p className="text-sm text-slate-500 mb-4">Butuh bantuan terkait akun Anda?</p>
                <button className="cursor-pointer w-full py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  Hubungi Support
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* TAB AKTIVASI WHATSAPP */
          <div className="max-w-2xl mx-auto">
            {user.is_verified && user.is_verified < 2 && (
              <div className="mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm shadow-orange-100">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl shrink-0 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                  <ShieldAlert size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-orange-900 text-lg leading-tight">Verifikasi Nomor Anda</h4>
                  <p className="text-sm text-orange-800/80 mt-1 mb-4">Fitur WhatsApp hanya aktif setelah Anda memasukkan kode OTP yang kami kirimkan.</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan 6 digit OTP"
                      className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-44"
                    />
                    <button className="cursor-pointer bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition-all shadow-md shadow-orange-200">
                      Verifikasi
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                  <MessageSquare size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Layanan WhatsApp</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm leading-relaxed">
                  Dapatkan laporan transaksi dan notifikasi keamanan langsung di ponsel Anda.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nomor Terdaftar</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      defaultValue={user.no_handphone}
                      placeholder='cth: 081212948372'
                      className="placeholder:text-slate-300 flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <button className="cursor-pointer bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                      Simpan
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${user.is_verified && user.is_verified > 2 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="text-sm font-bold text-slate-600">
                      Status: {user.is_verified && user.is_verified > 2 ? 'Aktif' : 'Menunggu Verifikasi'}
                    </span>
                  </div>
                  {user.is_verified && user.is_verified < 2 && (
                    <button className="cursor-pointer text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                      Kirim Ulang Kode
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};