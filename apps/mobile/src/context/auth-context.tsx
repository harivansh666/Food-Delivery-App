import { deleteToken, getToken } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import { User, UserRole } from "@food-delivery-app/types";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (date: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const token = await getToken();
      if (token) {
        setToken(token);
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to check existing session:", error);
      deleteToken();
    } finally {
      setIsLoading(false);
    }
  };

  // login user
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      setUser(response.data.user);
      setToken(response.data.token);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // register user
  const register = async (data: RegisterDto) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/register", data);
      setUser(response.data.user);
      setToken(response.data.token);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    await deleteToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};