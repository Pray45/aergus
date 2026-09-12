import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = {
    label: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    type?: React.HTMLInputTypeAttribute;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    name?: string;
    className?: string;
};

function Input({
    label,
    placeholder,
    required = false,
    disabled = false,
    type = "text",
    onChange,
    value,
    name,
    className = "",
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;

    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="font-mono text-xs font-bold uppercase tracking-wider text-aergus-text flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-aergus-primary"></span>{" "}
                {label}
            </label>
            <div className="relative">
                <input
                    type={inputType}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    onChange={onChange}
                    value={value}
                    className={`w-full bg-aergus-bg border border-aergus-border focus:border-aergus-primary rounded-none py-2.5 px-4 font-mono text-sm text-aergus-text placeholder:text-aergus-text-dim/40 focus:outline-none focus:ring-1 focus:ring-aergus-primary/20 transition-all ${type === "password" ? "pr-11" : ""}`}
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aergus-text-dim hover:text-aergus-text transition-colors cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Input;