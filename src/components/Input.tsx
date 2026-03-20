import type { ReactNode } from "react";

interface IProps {
  label: string;
  type?: string;
  placeholder?: string;
  name?: string;
  icon?: ReactNode;
}

export default function Input({ name, label, type = "text", placeholder, icon }: IProps) {
  return (
    <div className="group">
      <label className="block mb-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          name={name}
          type={type}
          placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
          className={`w-full ${icon ? "pl-11" : "pl-4"} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200
                     focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 text-slate-800 text-sm`}
        />
      </div>
    </div>
  );
}