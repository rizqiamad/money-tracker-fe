export default function UserAccountSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Garis biru samping (versi skeleton) */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200" />

          {/* Skeleton untuk Nama Akun */}
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse mb-3" />

          {/* Skeleton untuk Amount */}
          <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />

          {/* Shimmer effect tambahan (Optional overlay) */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      ))}
    </div>
  );
}