"use client";

import { useAuth } from "@/hooks/use-auth";
import { UploadButton } from "@/lib/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, User as UserIcon, Mail } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [key, setKey] = useState(0); 

  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Account Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Profile Picture</h2>
        
        <div className="flex items-start gap-8">
            <div className="flex flex-col items-center gap-3">
                <Avatar className="w-24 h-24 border-4 border-zinc-50 dark:border-zinc-800" key={key}>
                    <AvatarImage src={user.avatarUrl || ""} style={{ objectFit: "cover"}} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <span className="text-xs text-zinc-400">JPG, PNG up to 4MB</span>
            </div>
            <div className="flex-1 space-y-4 pt-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Upload a new avatar. The image will be resized automatically.
                </p>
                
                <div className="flex items-center gap-4">
                    <UploadButton
                        endpoint="profileImage"
                        onClientUploadComplete={async (res) => {
                            const uploadedUrl = res?.[0]?.ufsUrl || res?.[0]?.url;
                            
                            if (uploadedUrl) {
                                try {
                                    await api.patch("/users/avatar", { avatarUrl: uploadedUrl });
                                    updateUser({ avatarUrl: uploadedUrl });
                                    setKey(prev => prev + 1);
                                    
                                    toast.success("Avatar updated successfully!");
                                } catch (error) {
                                    console.error(error);
                                    toast.error("Image uploaded but failed to save to profile.");
                                }
                            }
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(`Error uploading: ${error.message}`);
                        }}
                        appearance={{
                            button: "bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors",
                            allowedContent: "hidden"
                        }}
                    />
                </div>
            </div>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 text-zinc-400" size={18}/>
                    <input disabled value={user.name} className="w-full pl-10 h-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 cursor-not-allowed text-sm"/>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-zinc-400" size={18}/>
                    <input disabled value={user.email} className="w-full pl-10 h-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 cursor-not-allowed text-sm"/>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}