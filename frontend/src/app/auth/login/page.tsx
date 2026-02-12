"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { loginSchema } from "@/modules/auth/auth.schema";
import { LoginForm } from "@/modules/auth/auth.types";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
    const { signIn, isLoading } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            await signIn(data);
        } catch (error) {
            console.error("Login failed handled via UI");
        }
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Log in to continue to your workspace.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider pl-1">Work Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Mail className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            {...register("email")}
                            type="email"
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            placeholder="name@company.com"
                        />
                    </div>
                    {errors.email && <span className="text-xs text-red-500 pl-1">{errors.email.message}</span>}
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between pl-1">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                            Password
                        </label>
                        <Link 
                            href="/auth/forgot-password" 
                            className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                            tabIndex={-1}
                        >
                            Forgot password?
                        </Link>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Lock className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            {...register("password")}
                            type="password"
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        />
                    </div>
                    {errors.password && <span className="text-xs text-red-500 pl-1">{errors.password.message}</span>}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging in..." : "Log In"}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </div>

                <p className="text-center text-sm text-text-muted mt-6">
                    Don't have an account?
                    <Link href="/auth/register" className="font-semibold text-primary hover:text-primary-hover transition-colors ml-1">
                        Get started
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}