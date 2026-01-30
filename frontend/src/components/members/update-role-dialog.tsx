"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { UserRole, User } from "@/types";
import { updateUserRole } from "@/services/users";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

interface UpdateRoleDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateRoleDialog({ user, open, onOpenChange }: UpdateRoleDialogProps) {
  const [role, setRole] = useState<UserRole>(UserRole.MEMBER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const { user: currentUser } = useAuth();
  const isSelf = currentUser?.id === user?.id;

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    
    if (isSelf) {
        toast.error("You cannot change your own role.");
        return;
    }

    setIsSubmitting(true);
    try {
        await updateUserRole(user.id, role);
        toast.success(`Role updated for ${user.name}`);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        onOpenChange(false);
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-100">Change Member Role</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Select the new access level for <span className="font-medium text-zinc-900 dark:text-zinc-300">{user.name}</span>.
          </DialogDescription>
        </DialogHeader>
        {isSelf ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex items-start gap-3 mt-2">
                <AlertTriangle className="text-amber-600 dark:text-amber-500 shrink-0" size={18} />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                    You cannot change your own role. Ask another Admin if you need to downgrade your permissions.
                </p>
            </div>
        ) : (
            <div className="py-4">
                <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2 block">Role</label>
                <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                    <option value={UserRole.MEMBER}>Member (Standard Access)</option>
                    <option value={UserRole.ADMIN}>Admin (Full Access)</option>
                </select>
            </div>
        )}

        <DialogFooter>
            <button 
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
                Close
            </button>
            {!isSelf && (
                <button 
                    disabled={isSubmitting} 
                    onClick={handleSubmit} 
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                    Save Changes
                </button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}