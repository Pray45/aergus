import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetchProjects: (workspaceId: string) => Promise<Project[]>;
  createProject: (
    workspaceId: string,
    name: string,
    description?: string,
  ) => Promise<Project>;
  setActiveProject: (project: Project | null) => void;
  clearProjects: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProject: null,
  loading: false,
  error: null,
  hasFetched: false,

  fetchProjects: async (workspaceId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_BASE_URL}/project?workspaceId=${workspaceId}`,
      );
      if (response.data && response.data.success) {
        const list = response.data.data as Project[];
        set({ projects: list, loading: false, hasFetched: true });

        const active = get().activeProject;
        if (list.length > 0) {
          if (!active || !list.some((p) => p.id === active.id)) {
            set({ activeProject: list[0] });
          }
        } else {
          set({ activeProject: null });
        }
        return list;
      }
      throw new Error(response.data?.message || "Failed to fetch projects");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch projects";
      set({ error: errMsg, loading: false, hasFetched: true });
      throw err;
    }
  },

  createProject: async (
    workspaceId: string,
    name: string,
    description?: string,
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/project/create`, {
        workspaceId,
        name,
        description,
      });
      if (response.data && response.data.success) {
        const newProj = response.data.data as Project;
        set((state) => {
          const list = [...state.projects, newProj];
          return {
            projects: list,
            activeProject: state.activeProject || newProj,
            loading: false,
          };
        });
        return newProj;
      }
      throw new Error(response.data?.message || "Failed to create project");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create project";
      set({ error: errMsg, loading: false });
      throw err;
    }
  },

  setActiveProject: (project: Project | null) => {
    set({ activeProject: project });
  },

  clearProjects: () => {
    set({ projects: [], activeProject: null, hasFetched: false });
  },
}));
