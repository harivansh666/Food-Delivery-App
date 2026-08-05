import { deleteToken, getToken, saveToken } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import { User, UserRole } from "@food-delivery-app/types";
import { router } from "expo-router";
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
  // const [user, setUser] = useState<User | null>({
  //   email: "rider@gmail.com",
  //   id: "1",
  //   name: "Harivansh",
  //   role: "ADMIN",

  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // });
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
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data);
      }
    } catch (error) {
      console.error("Failed to check existing session:", error);
      await deleteToken();
      delete axiosInstance.defaults.headers.common.Authorization;
    } finally {
      setIsLoading(false);
    }
  };

  // login user
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
     

      const { token: authToken, user: authUser } = response.data.data;
      setUser(authUser);
      setToken(authToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
      await saveToken(authToken);
      router.replace("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // register user
  const register = async (data: RegisterDto) => {
    try {
      const response = await axiosInstance.post("/auth/register", data);
      const { token: authToken, user: authUser } = response.data.data;
      setUser(authUser);
      setToken(authToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
      await saveToken(authToken);
      router.replace("/");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };
  const logout = async () => {
    await deleteToken();
    setUser(null);
    delete axiosInstance.defaults.headers.common.Authorization;
    router.replace("/login");
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
