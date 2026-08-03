import { create } from "zustand";

export interface AlertItem {
  id: string;
  source: string;
  message: string;
  severity: "CRITICAL" | "WARNING";
  timestamp: string;
  status: "ACTIVE" | "RESOLVED";
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  trigger: string;
  channels: string[];
}

export interface AlertChannel {
  id: string;
  name: string;
  type: string;
  target: string;
  status: string;
}

interface AlertState {
  alerts: AlertItem[];
  rules: AlertRule[];
  channels: AlertChannel[];
  
  addAlert: (alert: AlertItem) => void;
  resolveAlert: (id: string) => void;
  addRule: (rule: AlertRule) => void;
  removeRule: (id: string) => void;
  addChannel: (channel: AlertChannel) => void;
  removeChannel: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  rules: [],
  channels: [],

  addAlert: (alert) =>
    set((state) => ({ alerts: [alert, ...state.alerts] })),
  resolveAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, status: "RESOLVED" } : a)),
    })),
  addRule: (rule) =>
    set((state) => ({ rules: [rule, ...state.rules] })),
  removeRule: (id) =>
    set((state) => ({ rules: state.rules.filter((r) => r.id !== id) })),
  addChannel: (channel) =>
    set((state) => ({ channels: [channel, ...state.channels] })),
  removeChannel: (id) =>
    set((state) => ({ channels: state.channels.filter((c) => c.id !== id) })),
}));
