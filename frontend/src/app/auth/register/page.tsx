import { ArrowRight, Building2, Lock, Mail, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { registerSchema } from "@/modules/auth/auth.schema";
import { RegisterForm } from "@/modules/auth/auth.types";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function RegisterPage() {
    const { register: createAccount, isLoading } = useAuth();
    const searchParams = useSearchParams();
    const inviteToken = searchParams.get("invite");

    // Estado para guardar dados do convite (Nome da empresa)
    const [inviteData, setInviteData] = useState<{ company: { name: string } } | null>(null);
    const [isValidatingInvite, setIsValidatingInvite] = useState(!!inviteToken);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    // Valida o token ao carregar
    useEffect(() => {
        if (inviteToken) {
            setIsValidatingInvite(true);
            api.get(`/invites/${inviteToken}`)
                .then(res => {
                    setInviteData(res.data);
                    // Preenche um valor dummy no companyName para passar na validação do Zod frontend
                    // O backend vai ignorar isso se tiver inviteToken
                    setValue("companyName", res.data.company.name);
                })
                .catch(() => {
                    toast.error("Invalid or expired invite link");
                })
                .finally(() => setIsValidatingInvite(false));
        }
    }, [inviteToken, setValue]);

    const onSubmit = async (data: RegisterForm) => {
        // Adicionamos o token ao payload
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

                {/* Se NÃO for convite, mostra campo de empresa. Se FOR, mostra aviso visual */}
                {!inviteData ? (
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
                ) : (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-3">
                        <Building2 className="text-primary" size={24} />
                        <div>
                            <p className="text-sm font-bold text-gray-900">Joining: {inviteData.company.name}</p>
                            <p className="text-xs text-gray-500">As a Member</p>
                        </div>
                    </div>
                )}
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
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating..." : "Get Started"}
                        {!isLoading && <ArrowRight size={18} />}
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