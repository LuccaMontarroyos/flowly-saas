"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { verifyEmail } from "@/services/auth";
import { setCookie } from "nookies";
import { api } from "@/lib/api";
import { toast } from "sonner";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function runVerification() {
      if (!token) {
        setStatus("error");
        setMessage("Invalid or missing verification token.");
        return;
      }

      try {
        const result = await verifyEmail({ token });

        if (result?.token) {
          setCookie(undefined, "flowly.token", result.token, {
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
          });
          api.defaults.headers["Authorization"] = `Bearer ${result.token}`;
        }

        setStatus("success");
        setMessage("Email verified successfully! Redirecting to dashboard...");

        toast.success("Email verified", {
          description: "Your account is now active.",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Failed to verify email.";
        setStatus("error");
        setMessage(errorMessage);
      }
    }

    runVerification();
  }, [token, router]);

  let icon = <Loader2 className="animate-spin text-primary" size={40} />;
  let title = "Verifying your email...";
  let description = "Please wait while we confirm your account.";

  if (status === "success") {
    icon = <CheckCircle2 className="text-green-500" size={40} />;
    title = "Email verified!";
    description = message ?? "Your account is now active.";
  } else if (status === "error") {
    icon = <AlertCircle className="text-red-500" size={40} />;
    title = "Verification failed";
    description =
      message ??
      "The verification link is invalid or expired. Please request a new one.";
  }

  return (
    <AuthLayout title={title} subtitle={description}>
      <div className="flex flex-col items-center justify-center space-y-6 py-4">
        <div className="bg-gray-50 p-4 rounded-full">{icon}</div>
      </div>
    </AuthLayout>
  );
}

