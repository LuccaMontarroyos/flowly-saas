"use client";

import { useAuth } from "@/hooks/use-auth";
import { UploadButton } from "@/lib/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, User as UserIcon, Mail, Shield, Pencil, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordDialog } from "./change-password-dialog";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [key, setKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name });
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await api.patch("/users/me", { name: data.name });
      updateUser({ name: data.name });
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-zinc-500 mt-2">Manage your account settings and preferences.</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">        
          <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
               <Avatar className="w-28 h-28 border-4 border-white dark:border-zinc-800 shadow-md" key={key}>
                  <AvatarImage src={user.avatarUrl || ""} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                      {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
               <div className="absolute -bottom-2 -right-2">
                 <div className="relative overflow-hidden rounded-full shadow-md">
                   <UploadButton
                      endpoint="profileImage"
                      onClientUploadComplete={async (res) => {
                          const url = res?.[0]?.ufsUrl || res?.[0]?.url;
                          if (url) {
                              await api.patch("/users/avatar", { avatarUrl: url });
                              updateUser({ avatarUrl: url });
                              setKey(p => p + 1);
                              toast.success("Avatar updated!");
                          }
                      }}
                      onUploadError={(e) => {
                        toast.error(e.message);
                      }}
                      appearance={{
                          button: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 p-2 h-9 w-9 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 transition-all",
                          allowedContent: "hidden"
                      }}
                      content={{ button: <Pencil size={14} /> }}
                   />
                 </div>
               </div>
            </div>

            <div className="text-center md:text-left space-y-1 flex-1">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">{user.name}</h2>
                <p className="text-zinc-500 text-sm">{user.email}</p>
                <div className="pt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        {user.role}
                    </span>
                </div>
            </div>
          </div>
          <div className="p-8 space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Personal Information</h3>
                    <p className="text-sm text-zinc-500">Update your personal details here.</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/5"
                    >
                        <Pencil size={14} /> Edit Profile
                    </button>
                )}
             </div>

             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 text-zinc-400" size={18}/>
                            <input 
                                {...register("name")}
                                disabled={!isEditing}
                                className={`w-full pl-10 h-10 rounded-md border text-sm transition-all
                                    ${isEditing 
                                        ? "bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50" 
                                        : "bg-zinc-50 dark:bg-zinc-800/50 border-transparent text-zinc-600 cursor-not-allowed"
                                    }
                                `}
                            />
                        </div>
                        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-zinc-400" size={18}/>
                            <input 
                                disabled 
                                value={user.email} 
                                className="w-full pl-10 h-10 rounded-md border border-transparent bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 cursor-not-allowed text-sm"
                            />
                        </div>
                    </div>
                </div>
                {isEditing && (
                    <div className="flex items-center gap-3 pt-2 animate-in fade-in slide-in-from-top-2">
                        <button 
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                reset({ name: user.name });
                            }}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <X size={16} /> Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                )}
             </form>
          </div>
          <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
             <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                        <Shield size={18} className="text-primary" /> Security
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">Manage your password and account security.</p>
                </div>
                <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 text-zinc-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                    Change Password
                </button>
             </div>
          </div>

        </div>
      </div>

      <ChangePasswordDialog 
        open={isPasswordModalOpen} 
        onOpenChange={setIsPasswordModalOpen} 
      />
    </div>
  );
}