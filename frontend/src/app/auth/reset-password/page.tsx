"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, Suspense } from "react";
import { resetPasswordSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import { resetPassword } from "@/services/auth";

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
        toast.error("Invalid link. Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;
    try {
      await resetPassword({
        token,
        password: data.password,
      });
      toast.success("Password updated successfully!");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to reset password. Link might be expired.");
    }
  };

  if (!token) return null;

  return (
    <AuthLayout title="Set new password" subtitle="Create a new secure password for your account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">New Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            </div>
            <input
              {...register("password")}
              type="password"
              className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Min. 6 characters"
            />
          </div>
          {errors.password && <span className="text-xs text-red-500 pl-1">{errors.password.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">Confirm Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            </div>
            <input
              {...register("confirmPassword")}
              type="password"
              className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Confirm new password"
            />
          </div>
          {errors.confirmPassword && <span className="text-xs text-red-500 pl-1">{errors.confirmPassword.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}