import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetchWorkspaces: () => Promise<Workspace[]>;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  setActiveWorkspace: (workspace: Workspace | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  loading: false,
  error: null,
  hasFetched: false,

  fetchWorkspaces: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/workspace`);
      if (response.data && response.data.success) {
        const list = response.data.data as Workspace[];
        set({ workspaces: list, loading: false, hasFetched: true });

        const active = get().activeWorkspace;
        if (list.length > 0) {
          if (!active || !list.some((w) => w.id === active.id)) {
            set({ activeWorkspace: list[0] });
          }
        } else {
          set({ activeWorkspace: null });
        }
        return list;
      }
      throw new Error(response.data?.message || "Failed to fetch workspaces");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch workspaces";
      set({ error: errMsg, loading: false });
      throw err;
    }
  },

  createWorkspace: async (name: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/workspace`, {
        name,
        description,
      });
      if (response.data && response.data.success) {
        const newWS = response.data.data as Workspace;
        set((state) => {
          const list = [...state.workspaces, newWS];
          return {
            workspaces: list,
            activeWorkspace: state.activeWorkspace || newWS,
            loading: false,
            hasFetched: true,
          };
        });
        return newWS;
      }
      throw new Error(response.data?.message || "Failed to create workspace");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create workspace";
      set({ error: errMsg, loading: false });
      throw err;
    }
  },

  setActiveWorkspace: (workspace: Workspace | null) => {
    set({ activeWorkspace: workspace });
  },
}));
