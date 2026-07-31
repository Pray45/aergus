import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export interface User {
  id: number;
  email: string;
  userName: string;
  avatar?: string | null;
  role?: string; // Optional role for access control (e.g. 'admin', 'user')
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  checkingAuth: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoggedIn: (value: boolean) => void;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  checkingAuth: true,

  setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
  setUser: (user: User | null) => set({ user }),
  setToken: (token: string | null) => set({ token }),

  googleLogin: async () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    if (response.data && response.data.success) {
      set({
        user: response.data.user,
        isLoggedIn: true,
        token: response.data.token || null,
      });
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  },

  register: async (fullName, email, password) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      userName: fullName,
      email,
      password,
    });
    if (response.data && response.data.success) {
      set({
        user: response.data.user,
        isLoggedIn: true,
        token: response.data.token || null,
      });
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`);
    } catch (err) {
      console.error("Backend logout error:", err);
    } finally {
      set({ user: null, isLoggedIn: false, token: null });
    }
  },

  checkSession: async () => {
    try {
      set({ checkingAuth: true });
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
      if (response.data && response.data.success) {
        set({ user: response.data.user, isLoggedIn: true });
      } else {
        set({ user: null, isLoggedIn: false, token: null });
      }
    } catch (err) {
      set({ user: null, isLoggedIn: false, token: null });
    } finally {
      set({ checkingAuth: false });
    }
  },
}));

// Response interceptor to handle token refresh automatically
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/register")
    ) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint to get new access token cookie
        await axios.post(`${API_BASE_URL}/api/auth/refresh`);
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth state
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setToken(null);
        useAuthStore.getState().setIsLoggedIn(false);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);