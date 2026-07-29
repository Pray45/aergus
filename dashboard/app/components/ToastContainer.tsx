"use client";

import React from "react";
import { useToastStore } from "../store/toastStore";
import { ToastItem } from "./ToastItem";

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3.5 w-full max-w-[calc(100vw-3rem)] md:w-auto pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
