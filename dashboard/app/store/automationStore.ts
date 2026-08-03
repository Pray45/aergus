import { create } from "zustand";

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: "ACTIVE" | "DRAFT" | "STAGING";
}

interface AutomationState {
  rules: AutomationRule[];
  addRule: (rule: AutomationRule) => void;
  removeRule: (id: string) => void;
}

export const useAutomationStore = create<AutomationState>((set) => ({
  rules: [], // Starts empty by default
  addRule: (rule) => set((state) => ({ rules: [rule, ...state.rules] })),
  removeRule: (id) => set((state) => ({ rules: state.rules.filter((r) => r.id !== id) })),
}));
