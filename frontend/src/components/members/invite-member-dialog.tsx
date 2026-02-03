"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Link as LinkIcon, Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { UserRole } from "@/types";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
        const response = await api.post("/invites", { role: UserRole.MEMBER });
        setInviteLink(response.data.link);
    } catch (error) {
        toast.error("Failed to generate invite link");
    } finally {
        setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setHasCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleClose = () => {
      setInviteLink("");
      onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-100">Invite Members</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Generate a unique link to share with your team members. Anyone with this link can join your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
            {!inviteLink ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        <LinkIcon className="text-zinc-500" size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-medium text-zinc-900 dark:text-white">Invite via Link</h3>
                        <p className="text-sm text-zinc-500 max-w-[280px] mx-auto">
                            Create a secure link that allows members to join your organization instantly.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Invite Link</label>
                    <div className="flex items-center gap-2">
                        <input 
                            readOnly 
                            value={inviteLink}
                            className="flex-1 h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-300 focus:outline-none"
                        />
                        <button 
                            onClick={copyToClipboard}
                            className="h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            {hasCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-zinc-500" />}
                        </button>
                    </div>
                    <p className="text-xs text-zinc-500">This link expires in 7 days.</p>
                </div>
            )}
        </div>

        <DialogFooter>
            {!inviteLink ? (
                <button 
                    disabled={isLoading} 
                    onClick={handleGenerateLink} 
                    className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isLoading && <Loader2 className="animate-spin" size={16} />}
                    Generate Link
                </button>
            ) : (
                <button 
                    onClick={handleClose} 
                    className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Done
                </button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}