"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema } from "@/modules/auth/auth.schema";
import { RegisterForm } from "@/modules/auth/auth.types";
import { toast } from "sonner";


export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            setLoading(true);
            const response = await api.post("/auth/register", data);
            localStorage.setItem("flowly-token", response.data.token);

            toast.success("Account created!", {
                description: `Welcome to Flowly, ${data.name}`,
                className: "bg-green-500 text-white border-none",
            })
            router.push("/dashboard");
        } catch (error: any) {
            toast.error("Registration failed", {
                description: error.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create your workspace" subtitle="Start managing projects with precision.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider pl-1">Company Name</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Building2 className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            {...register("companyName")}
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            placeholder="Acme Inc."
                        />
                    </div>
                    {errors.companyName && <span className="text-xs text-red-500 pl-1">{errors.companyName.message}</span>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider pl-1">Full Name</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <User className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            {...register("name")}
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            placeholder="Jane Doe"
                        />
                    </div>
                    {errors.name && <span className="text-xs text-red-500 pl-1">{errors.name.message}</span>}
                </div>

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
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider pl-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Lock className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            {...register("password")}
                            type="password"
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            placeholder="Min. 8 characters"
                        />
                    </div>
                    {errors.password && <span className="text-xs text-red-500 pl-1">{errors.password.message}</span>}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : "Get Started"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </div>

                <p className="text-center text-sm text-text-muted mt-6">
                    Already have an account?
                    <Link href="/auth/login" className="font-semibold text-primary hover:text-primary-hover transition-colors ml-1">
                        Log in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}