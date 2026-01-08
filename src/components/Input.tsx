interface IProps {
  label: string;
  type?: string;
  placeholder?: string;
}

export default function Input({ label, type = "text", placeholder }: IProps) {
  return (
    <div className="group">
      <label className="block mb-1.5 text-sm font-semibold text-slate-700 group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200
                   focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
      />
    </div>
  );
}