"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { z } from "zod";
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await api.post("/auth/forgot-password", data);
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout title="Check your email" subtitle="We have sent a password reset link to your email.">
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle2 className="text-green-500 w-12 h-12" />
          </div>
          <p className="text-center text-sm text-gray-500">
            Did not receive the email? Check your spam folder or try again.
          </p>
          <Link 
            href="/auth/login"
            className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to log in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">Work Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            </div>
            <input
              {...register("email")}
              type="email"
              className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="name@company.com"
            />
          </div>
          {errors.email && <span className="text-xs text-red-500 pl-1">{errors.email.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
        </button>

        <div className="text-center mt-6">
           <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2">
             <ArrowLeft size={16} /> Back to log in
           </Link>
        </div>
      </form>
    </AuthLayout>
  );
}