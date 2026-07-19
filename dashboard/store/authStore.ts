import axios from 'axios';
import { create } from 'zustand';

const baseurl = "http://localhost:5000/api"

export interface User {
    id: number;
    email: string;
    userName: string;
    avatar?: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
    checkingAuth: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setIsLoggedIn: (value: boolean) => void;
    setError: (error: string | null) => void;

    register: (userName: string, email: string, password: string) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    checkingAuth: true,
    setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
    setUser: (user: User | null) => set({ user }),
    setToken: (token: string | null) => set({ token }),
    setError: (error: string | null) => set({ error }),

    register: async (userName: string, email: string, password: string) => {
        try {
            set({ loading: true, error: null })
            const response = await axios.post(
                `${baseurl}/auth/register`,
                { userName, email, password },
                { withCredentials: true }
            )

            if (response.status === 200 || response.status === 201) {
                const cookies = response.headers['set-cookie'];

                if (cookies) {
                    const tokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));

                    if (tokenCookie) {
                        const accessToken = tokenCookie.split('=')[1].split(';')[0];
                        set({ token: accessToken })
                    }
                }

                set({
                    user: response.data.user,
                    isLoggedIn: true,
                })
                return true;
            }
            return false;
        } catch (err: any) {
            console.error("Register failed", err);
            const errMsg = err.response?.data?.message || "Registration failed. Please try again.";
            set({ error: errMsg, isLoggedIn: false });
            return false;
        } finally {
            set({ loading: false })
        }
    },

    login: async (email: string, password: string) => {
        try {
            set({ loading: true, error: null })
            const response = await axios.post(
                `${baseurl}/auth/login`,
                { email, password },
                { withCredentials: true }
            )

            if (response.status === 200 || response.status === 201) {
                const cookies = response.headers['set-cookie'];

                if (cookies) {
                    const tokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));

                    if (tokenCookie) {
                        const accessToken = tokenCookie.split('=')[1].split(';')[0];
                        set({ token: accessToken })
                    }
                }

                set({
                    user: response.data.user,
                    isLoggedIn: true,
                })
                return true;
            } else {
                set({ isLoggedIn: false })
                return false;
            }
        } catch (err: any) {
            console.error("Login failed", err);
            const errMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
            set({ error: errMsg, isLoggedIn: false });
            return false;
        } finally {
            set({ loading: false })
        }
    },

    logout: async () => {
        try {
            set({ loading: true, error: null })
            await axios.post(`${baseurl}/auth/logout`, {}, { withCredentials: true });
            set({ user: null, token: null, isLoggedIn: false });
            return true;
        } catch (err) {
            console.error("Logout failed:", err);
            set({ user: null, token: null, isLoggedIn: false });
            return false;
        } finally {
            set({ loading: false })
        }
    },

    checkAuth: async () => {
        try {
            set({ checkingAuth: true, error: null });
            const response = await axios.get(
                `${baseurl}/auth/me`,
                { withCredentials: true }
            );
            if (response.data && response.data.success) {
                set({
                    user: response.data.user,
                    isLoggedIn: true,
                });
                return true;
            } else {
                set({ user: null, isLoggedIn: false });
                return false;
            }
        } catch (err) {
            set({ user: null, isLoggedIn: false });
            return false;
        } finally {
            set({ checkingAuth: false });
        }
    }
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
            !originalRequest.url.includes('/auth/refresh') &&
            !originalRequest.url.includes('/auth/login') &&
            !originalRequest.url.includes('/auth/register')
        ) {
            originalRequest._retry = true;
            try {
                // Call refresh endpoint to get new access token cookie
                await axios.post(`${baseurl}/auth/refresh`, {}, { withCredentials: true });
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