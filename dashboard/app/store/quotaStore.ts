import { create } from "zustand";

interface QuotaState {
  isOpen: boolean;
  error: string | null;
  openQuotaModal: (error?: string) => void;
  closeQuotaModal: () => void;
}

export const useQuotaStore = create<QuotaState>((set) => ({
  isOpen: false,
  error: null,
  openQuotaModal: (error?: string) => {
    set({
      isOpen: true,
      error: error || "Instance limit reached for your current subscription tier.",
    });
  },
  closeQuotaModal: () => {
    set({
      isOpen: false,
      error: null,
    });
  },
}));
