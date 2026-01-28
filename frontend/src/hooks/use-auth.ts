import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { LoginForm, RegisterForm } from "@/modules/auth/auth.types";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/register", data);
      localStorage.setItem("flowly-token", response.data.token);

      toast.success("Account created successfully!", {
        description: `Welcome to Flowly, ${data.name}.`,
        className: "bg-green-500 text-white border-none",
      });

      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      
      toast.error("Registration failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", data);
      
      localStorage.setItem("flowly-token", response.data.token);

      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
        className: "bg-green-500 text-white border-none",
      });

      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Invalid credentials.";

      toast.error("Access denied", {
        description: errorMessage,
        className: "bg-red-500 text-white border-none",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    loginUser,
    isLoading,
  };
}