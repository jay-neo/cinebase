import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "~/config/api";

interface User {
  name: string;
  email: string;
  username: string;
  avatar: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
  isCredentialAccount: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initContext: (response: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get user from backend
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await api.get("/auth/user");
          if (response.data?.user) {
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        localStorage.removeItem("accessToken");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("accessToken", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.delete("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  const initContext = async (response: any) => {
    if (response?.data?.user && response.headers?.authorization) {
      const token = response.headers.authorization.split(" ")[1];
      login(response.data.user, token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        initContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

