import { create } from "zustand";

export interface Provider {
  id: string;
  name: string;
  category: "CLOUD" | "DATABASE" | "CONTAINER" | "SECURITY";
  description: string;
  status: "CONNECTED" | "AVAILABLE" | "COMING_SOON";
}

interface IntegrationState {
  providers: Provider[];
  connectProvider: (id: string) => void;
  disconnectProvider: (id: string) => void;
}

export const useIntegrationStore = create<IntegrationState>((set) => ({
  providers: [
    { id: "1", name: "Cloudflare", category: "SECURITY", description: "DNS routing, SSL certs provisioning, CDN proxies.", status: "AVAILABLE" },
    { id: "2", name: "Docker Host", category: "CONTAINER", description: "Spin up and monitor containers on docker engines.", status: "AVAILABLE" },
    { id: "3", name: "Amazon Web Services", category: "CLOUD", description: "Fetch EC2 metrics, RDS stats, and security groups.", status: "AVAILABLE" },
    { id: "4", name: "GitHub Actions", category: "SECURITY", description: "Trigger code compilation & secure deployments pipelines.", status: "AVAILABLE" },
    { id: "5", name: "Linux Server", category: "CLOUD", description: "Raw SSH daemon agent host system utilization metrics.", status: "AVAILABLE" },
    { id: "6", name: "PostgreSQL Database", category: "DATABASE", description: "Connect to database tables and monitor load and pools.", status: "AVAILABLE" },
    { id: "7", name: "Redis Cache", category: "DATABASE", description: "Key-value cache telemetry, keys index size alerts.", status: "COMING_SOON" },
    { id: "8", name: "Microsoft Azure", category: "CLOUD", description: "Monitor active Azure VM infrastructure resources.", status: "COMING_SOON" },
  ],
  connectProvider: (id) =>
    set((state) => ({
      providers: state.providers.map((p) =>
        p.id === id ? { ...p, status: "CONNECTED" } : p
      ),
    })),
  disconnectProvider: (id) =>
    set((state) => ({
      providers: state.providers.map((p) =>
        p.id === id ? { ...p, status: "AVAILABLE" } : p
      ),
    })),
}));
