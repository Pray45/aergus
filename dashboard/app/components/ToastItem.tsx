import React from "react";
import { CheckCircle2, AlertOctagon, Info, X } from "lucide-react";
import { Toast, useToastStore } from "../store/toastStore";

interface ToastItemProps {
  toast: Toast;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const config = {
    success: {
      label: "[SUCCESS]",
      icon: <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />,
      borderColor: "border-[#22c55e]/30",
      bgColor: "bg-black/90",
      progressBg: "bg-[#22c55e]",
      shadow: "shadow-[0_0_15px_rgba(34,197,94,0.1)]",
      textColor: "text-[#22c55e]",
    },
    error: {
      label: "[ERROR_ENCOUNTERED]",
      icon: <AlertOctagon className="w-4 h-4 text-[#ff3100] flex-shrink-0" />,
      borderColor: "border-[#ff3100]/30",
      bgColor: "bg-black/90",
      progressBg: "bg-[#ff3100]",
      shadow: "shadow-[0_0_15px_rgba(255,49,0,0.1)]",
      textColor: "text-[#ff3100]",
    },
    info: {
      label: "[SYSTEM_INFO]",
      icon: <Info className="w-4 h-4 text-white/60 flex-shrink-0" />,
      borderColor: "border-white/10",
      bgColor: "bg-black/90",
      progressBg: "bg-white/40",
      shadow: "shadow-[0_0_15px_rgba(255,255,255,0.03)]",
      textColor: "text-white/60",
    },
  };

  const current = config[toast.type] || config.info;
  const duration = toast.duration || 4000;

  return (
    <div
      className={`w-full md:w-96 rounded-sm border ${current.borderColor} ${current.bgColor} ${current.shadow} p-4 relative overflow-hidden font-mono text-xs flex gap-3.5 transition-all duration-300 pointer-events-auto`}
      role="alert"
    >
      {/* Type Icon */}
      {current.icon}

      {/* Content */}
      <div className="flex-grow space-y-1 pr-4">
        <header className={`font-bold ${current.textColor} uppercase tracking-wider text-[10px]`}>
          {current.label}
        </header>
        <p className="text-[#e5e2e1] leading-relaxed uppercase tracking-tight">{toast.message}</p>
      </div>

      {/* Manual Dismiss */}
      <button
        onClick={() => removeToast(toast.id)}
        className="text-white/30 hover:text-[#ff3100] transition-colors self-start cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Style element injecting local animation keyframes */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .progress-bar {
          animation: shrink ${duration}ms linear forwards;
        }
      `}</style>

      {/* Floating Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white/5 pointer-events-none">
        <div className={`h-full progress-bar ${current.progressBg}`} />
      </div>
    </div>
  );
};
