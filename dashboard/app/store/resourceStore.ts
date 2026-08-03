import { create } from "zustand";

export interface Resource {
  id: string;
  name: string;
  type: "Website" | "Server" | "Database" | "Docker Host" | "Container" | "Certificate";
  provider: "AWS" | "Cloudflare" | "Docker" | "Linux" | "Azure" | "Self-Hosted";
  status: "ACTIVE" | "WARNING" | "CRITICAL" | "MAINTENANCE";
  health: number;
  tags: string[];
  lastCheck: string;
}

interface ResourceState {
  resources: Resource[];
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [], // Starts empty by default
  addResource: (resource) =>
    set((state) => ({ resources: [resource, ...state.resources] })),
  removeResource: (id) =>
    set((state) => ({ resources: state.resources.filter((r) => r.id !== id) })),
}));
