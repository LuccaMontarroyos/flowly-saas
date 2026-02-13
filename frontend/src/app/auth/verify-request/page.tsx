"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function VerifyRequestPage() {
  return (
    <AuthLayout
      title="Check your email"
      subtitle="We sent you a verification link to confirm your account."
    >
      <div className="space-y-4 text-sm text-gray-600">
        <p>
          To finish setting up your account, please click the verification link
          we sent to your email address.
        </p>
        <p>
          If you don&apos;t see the email, check your spam folder or try again
          in a few minutes.
        </p>
        <p className="pt-2">
          Already verified?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Go to login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

