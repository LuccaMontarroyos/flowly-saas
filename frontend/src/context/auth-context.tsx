"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { UserRole } from "@/types"; 
import { toast } from "sonner";
import { LoginForm, RegisterForm } from "@/modules/auth/auth.types";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
  companyId: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  signIn: (data: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  signOut: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "flowly.token": token } = parseCookies();

    if (token) {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      api.get("/users/me")
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Token inválido, fazendo logout forçado:", error);
          destroyCookie(undefined, "flowly.token", { path: '/' }); 
          
          delete api.defaults.headers["Authorization"];
          setUser(null);
          router.replace("/auth/login");
        })
        .finally(() => {
            setIsLoading(false);
        });
    } else {
        setIsLoading(false);
    }
  }, []);

  async function signIn({ email, password }: LoginForm) {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      setCookie(undefined, "flowly.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      setUser(user);
      
      toast.success("Welcome back!", {
         description: "You have successfully logged in.",
         className: "bg-green-500 text-white border-none"
      });

      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Invalid credentials.";
      toast.error("Access denied", { description: errorMessage });
      throw error;
    }
  }

  async function register(data: RegisterForm) {
    try {
      const response = await api.post("/auth/register", data);
      const { token, user } = response.data;
      
      if (token) {
          setCookie(undefined, "flowly.token", token, {
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
          });
          api.defaults.headers["Authorization"] = `Bearer ${token}`;
          setUser(user);
      }

      toast.success("Account created successfully!", {
        description: `Welcome to Flowly, ${data.name}.`,
        className: "bg-green-500 text-white border-none",
      });

      router.push("/dashboard");
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Registration failed.";
        toast.error("Registration failed", { description: errorMessage });
        throw error;
    }
  }

  function signOut() {
    destroyCookie(undefined, "flowly.token");
    
    delete api.defaults.headers["Authorization"];
    
    setUser(null);
    router.push("/auth/login");
  }

  function updateUser(userData: Partial<User>) {
    setUser((currentUser) => {
        if (!currentUser) return null;
        return { ...currentUser, ...userData };
    });
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, register, signOut, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}