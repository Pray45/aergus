import React, { useState } from "react";
import { LucideEye, LucideEyeOff } from "lucide-react";

interface FieldProps {
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  required?: boolean;
  name?: string;
}

export const Field: React.FC<FieldProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  helperText,
  required = false,
  name,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 flex items-center gap-2">
        {label}
        <span className="w-1 h-1 bg-[#ff3100]"></span>
      </label>
      <div
        className={`relative hairline-border hairline-border-focus bg-black rounded-sm transition-all group ${
          isFocused
            ? "shadow-[0_0_20px_rgba(255,49,0,0.1)] border-[#ff3100]"
            : ""
        }`}
      >
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent border-none text-white placeholder:text-white/20 focus:ring-0 focus:outline-none py-3 px-4 font-mono text-sm"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#ff3100] transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <LucideEye /> : <LucideEyeOff />}
          </button>
        )}
      </div>
      {helperText && (
        <div className="flex justify-between items-center mt-1">
          <p className="text-[9px] text-white/30 font-mono uppercase tracking-tighter">
            {helperText}
          </p>
        </div>
      )}
    </div>
  );
};
