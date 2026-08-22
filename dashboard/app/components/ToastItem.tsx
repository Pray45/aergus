"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { Toast, useToastStore } from "../store/toastStore";

interface ToastItemProps {
  toast: Toast;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const config = {
    success: {
      label: "SUCCESS",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />,
      borderColor: "border-green-500/40 dark:border-green-500/50",
      accentBg: "bg-green-500/10",
      progressBg: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
    },
    error: {
      label: "ERROR",
      icon: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
      borderColor: "border-red-500/40 dark:border-red-500/50",
      accentBg: "bg-red-500/10",
      progressBg: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400",
    },
    warning: {
      label: "WARNING",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />,
      borderColor: "border-yellow-500/40 dark:border-yellow-500/50",
      accentBg: "bg-yellow-500/10",
      progressBg: "bg-yellow-500",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    info: {
      label: "INFORMATION",
      icon: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
      borderColor: "border-blue-500/40 dark:border-blue-500/50",
      accentBg: "bg-blue-500/10",
      progressBg: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
    },
  };

  const current = config[toast.type] || config.info;
  const duration = toast.duration || 4000;

  return (
    <div
      className={`w-full md:w-96 rounded-none border ${current.borderColor} bg-aergus-card text-aergus-text shadow-xl backdrop-blur-md p-4 relative overflow-hidden font-mono text-xs flex items-start gap-3 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-2 duration-200`}
      role="alert"
    >
      {/* Type Icon Badge */}
      <div className={`p-1.5 rounded-none ${current.accentBg} shrink-0 self-start`}>
        {current.icon}
      </div>

      {/* Content */}
      <div className="flex-grow space-y-0.5 pr-2 min-w-0">
        <header
          className={`font-bold ${current.textColor} uppercase tracking-wider text-[10px]`}
        >
          {current.label}
        </header>
        <p className="text-aergus-text leading-relaxed text-xs font-sans break-words">
          {toast.message}
        </p>
      </div>

      {/* Manual Dismiss */}
      <button
        onClick={() => removeToast(toast.id)}
        className="text-aergus-text-dim hover:text-aergus-text transition-colors self-start p-1 rounded hover:bg-aergus-text/5 cursor-pointer shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Animation Style */}
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

      {/* Bottom Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-aergus-border/40 pointer-events-none">
        <div className={`h-full progress-bar ${current.progressBg}`} />
      </div>
    </div>
  );
};
