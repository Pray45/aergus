import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    token,
    isLoggedIn,
    loading,
    error,
    checkingAuth,
    register: storeRegister,
    login: storeLogin,
    logout: storeLogout,
    checkAuth: storeCheckAuth,
    setError,
  } = useAuthStore();

  const login = async (email: string, password: string) => {
    setError(null);
    const success = await storeLogin(email, password);
    if (success) {
      router.push("/");
    }
    return success;
  };

  const register = async (userName: string, email: string, password: string) => {
    setError(null);
    const success = await storeRegister(userName, email, password);
    if (success) {
      router.push("/");
    }
    return success;
  };

  const logout = async () => {
    setError(null);
    const success = await storeLogout();
    if (success) {
      router.push("/login");
    }
    return success;
  };

  const checkAuth = async () => {
    return await storeCheckAuth();
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return {
    user,
    token,
    isLoggedIn,
    loading,
    error,
    checkingAuth,
    login,
    register,
    logout,
    checkAuth,
    handleGoogleLogin,
  };
}
