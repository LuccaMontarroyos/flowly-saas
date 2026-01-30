"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { UserRole } from "@/types";

const inviteSchema = z.object({
  email: z.email("Invalid email address"),
  role: z.enum(UserRole),
});

type InviteForm = z.infer<typeof inviteSchema>;

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: UserRole.MEMBER }
  });

  const onSubmit = async (data: InviteForm) => {
    setIsSubmitting(true);
    // Simulação de chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Inviting:", data);
    toast.success(`Invitation sent to ${data.email}`);
    
    setIsSubmitting(false);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-100">Invite Team Member</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Send an invitation email to a new member to join your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Email Address</label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                <input 
                    {...register("email")}
                    className="flex h-10 w-full pl-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="colleague@company.com" 
                />
            </div>
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Role</label>
            <select 
                {...register("role")}
                className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
                <option value={UserRole.MEMBER}>Member</option>
                <option value={UserRole.ADMIN}>Admin</option>
            </select>
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
                disabled={isSubmitting} 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                {isSubmitting ? "Sending..." : "Send Invite"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}