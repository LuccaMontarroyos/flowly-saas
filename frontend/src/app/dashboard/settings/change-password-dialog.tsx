"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { changePasswordSchema } from "@/modules/users/user.schema";
import { ChangePasswordFormValues } from "@/modules/users/user.types";
import { changeUserPassword } from "@/services/users";

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormValues) => {
        try {
            await changeUserPassword(data);
            
            toast.success("Password changed successfully!");
            reset();
            onOpenChange(false);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to change password";
            toast.error(msg);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <KeyRound size={18} className="text-primary" />
                        Change Password
                    </DialogTitle>
                    <DialogDescription>
                        For your security, please enter your current password before setting a new one.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Current Password</label>
                        <input 
                            type="password"
                            {...register("oldPassword")}
                            className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="••••••"
                        />
                        {errors.oldPassword && <span className="text-xs text-red-500">{errors.oldPassword.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
                        <input 
                            type="password"
                            {...register("newPassword")}
                            className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="••••••"
                        />
                        {errors.newPassword && <span className="text-xs text-red-500">{errors.newPassword.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm New Password</label>
                        <input 
                            type="password"
                            {...register("confirmPassword")}
                            className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="••••••"
                        />
                        {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                    </div>

                    <DialogFooter>
                        <button 
                            type="button" 
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting} 
                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                            Change Password
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}