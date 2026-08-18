import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const getSavedToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

const getSavedRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
};

const saveTokens = (token?: string | null, refreshToken?: string | null) => {
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("access_token", token);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
  }
};

const clearSavedTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

// Request interceptor to automatically attach Authorization header
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || getSavedToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  userName: string;
  avatar?: string | null;
  tier?: string;
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
  upgradeTier: (tier: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getSavedToken(),
  isLoggedIn: false,
  checkingAuth: true,

  setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
  setUser: (user: User | null) => set({ user }),
  setToken: (token: string | null) => {
    saveTokens(token);
    set({ token });
  },

  googleLogin: async () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    if (response.data && response.data.success) {
      const token = response.data.token || null;
      const refreshToken = response.data.refreshToken || null;
      saveTokens(token, refreshToken);
      set({
        user: response.data.user,
        isLoggedIn: true,
        token: token,
      });
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  },

  register: async (fullName, email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      userName: fullName,
      email,
      password,
    });
    if (response.data && response.data.success) {
      const token = response.data.token || null;
      const refreshToken = response.data.refreshToken || null;
      saveTokens(token, refreshToken);
      set({
        user: response.data.user,
        isLoggedIn: true,
        token: token,
      });
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (err) {
      console.error("Backend logout error:", err);
    } finally {
      clearSavedTokens();
      set({ user: null, isLoggedIn: false, token: null });
    }
  },

  checkSession: async () => {
    try {
      set({ checkingAuth: true });
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      if (response.data && response.data.success) {
        set({ user: response.data.user, isLoggedIn: true });
      } else {
        clearSavedTokens();
        set({ user: null, isLoggedIn: false, token: null });
      }
    } catch (err) {
      clearSavedTokens();
      set({ user: null, isLoggedIn: false, token: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  upgradeTier: async (tier: string) => {
    const response = await axios.patch(`${API_BASE_URL}/auth/tier`, {
      tier,
    });
    if (response.data && response.data.success) {
      set({ user: response.data.user });
    } else {
      throw new Error(response.data.message || "Failed to upgrade tier");
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
        const refreshToken = getSavedRefreshToken();
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const newToken = response.data?.token;
        const newRefreshToken = response.data?.refreshToken;
        if (newToken) {
          saveTokens(newToken, newRefreshToken);
          useAuthStore.getState().setToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        clearSavedTokens();
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setToken(null);
        useAuthStore.getState().setIsLoggedIn(false);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
