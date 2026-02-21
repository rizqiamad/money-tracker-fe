import { ChevronLeft, ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";

export default function Pagination({
  currentPage, totalPages, totalItems, perPage, onPageChange, onPerPageChange
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (n: number) => void;
}) {
  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }, [currentPage, totalPages]);

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 bg-slate-50/50">
      {/* Info + Per Page */}
      <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
        <p className="text-xs text-slate-500">
          Menampilkan <span className="font-bold text-slate-700">{start}–{end}</span> dari{" "}
          <span className="font-bold text-slate-700">{totalItems}</span> transaksi
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">Per halaman:</span>
          <select
            value={perPage}
            onChange={(e) => { onPerPageChange(Number(e.target.value)); onPageChange(1); }}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Page Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="cursor-pointer p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`e-${i}`} className="px-1.5 text-slate-400 text-xs select-none">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`cursor-pointer min-w-8 h-8 rounded-lg text-xs font-bold border transition-all ${currentPage === page
                ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="cursor-pointer p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRightIcon size={14} />
        </button>
      </div>
    </div>
  );
};