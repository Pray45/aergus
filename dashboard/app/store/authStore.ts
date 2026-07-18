import {create} from 'zustand';

interface User{
    id:number;
    email:string;
    userName:string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    setIsLoggedIn: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    
    isLoggedIn: false,
    setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
    
    setUser: (user: any) => set({ user }),
    setToken: (token: string) => set({ token }),
    
}));