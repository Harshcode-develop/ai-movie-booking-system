import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, AuthResponse } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  googleSignIn: (
    googleId: string,
    email: string,
    name: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const profile = await authService.getProfile(savedToken);
          setUser(profile);
          setToken(savedToken);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const handleAuthResponse = (response: AuthResponse) => {
    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser({
      id: response.userId,
      email: response.email,
      fullName: response.fullName,
      phone: "",
      age: 0,
    });
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    handleAuthResponse(response);
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const response = await authService.signup({ email, password, fullName });
    handleAuthResponse(response);
  };

  const googleSignIn = async (
    googleId: string,
    email: string,
    name: string,
  ) => {
    const response = await authService.googleSignIn(googleId, email, name);
    handleAuthResponse(response);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        googleSignIn,
        logout,
        updateUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
