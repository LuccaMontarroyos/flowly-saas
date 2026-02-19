"use client";
import { ArrowRight, Building2, Lock, Mail, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/modules/auth/auth.types";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/auth.schema";
import { getInviteDetails } from "@/services/invites";

function RegisterContent() {
    const { register: createAccount, isLoading } = useAuth();
    const searchParams = useSearchParams();
    const inviteToken = searchParams.get("invite");

    const [inviteData, setInviteData] = useState<{ company: { name: string } } | null>(null);
    const [isValidatingInvite, setIsValidatingInvite] = useState(!!inviteToken);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        if (inviteToken) {
            setIsValidatingInvite(true);
            getInviteDetails(inviteToken)
                .then(data => {
                    setInviteData(data);
                    setValue("companyName", data.company.name);
                })
                .catch(() => {
                    toast.error("Invalid or expired invite link");
                })
                .finally(() => setIsValidatingInvite(false));
        }
    }, [inviteToken, setValue]);

    const onSubmit = async (data: RegisterForm) => {
        const payload = inviteToken ? { ...data, inviteToken } : data;
        await createAccount(payload);
    };

    if (isValidatingInvite) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <AuthLayout
            title={inviteData ? "Join Workspace" : "Create your workspace"}
            subtitle={inviteData ? `You have been invited to join ${inviteData.company.name}` : "Start managing projects with precision."}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            </form>
        </AuthLayout>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}