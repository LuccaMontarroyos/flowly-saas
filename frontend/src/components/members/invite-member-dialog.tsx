"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Link as LinkIcon, Check, Copy, Mail, Send } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const handleSendInvite = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
        const response = await api.post("/invites", { 
            role: UserRole.MEMBER,
            email: email || undefined 
        });
        
        setInviteLink(response.data.link);
        
        if (email) {
            toast.success(`Invite sent to ${email}`);
            setEmail("");
        } else {
            toast.success("Invite link generated");
        }
    } catch (error) {
        toast.error("Failed to send invite");
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
      setEmail("");
      onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-100">Invite Members</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Send an email invitation or share a unique link to join your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-6">
            <form onSubmit={handleSendInvite} className="space-y-3">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Invite by Email
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                        <input 
                            type="email"
                            placeholder="colleague@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 h-10 rounded-md border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading || !email}
                        className="bg-primary hover:bg-primary/90 text-white px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading && email ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        Send
                    </button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500">Or generate link</span>
                </div>
            </div>

            <div className="space-y-3">
                {!inviteLink ? (
                    <button 
                        type="button"
                        onClick={() => handleSendInvite()}
                        disabled={isLoading}
                        className="w-full h-10 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                        {isLoading && !email ? <Loader2 className="animate-spin" size={16} /> : <LinkIcon size={16} />}
                        Generate a unique invite link
                    </button>
                ) : (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            Share Link
                        </label>
                        <div className="flex items-center gap-2">
                            <input 
                                readOnly 
                                value={inviteLink}
                                className="flex-1 h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-300 focus:outline-none"
                            />
                            <button 
                                onClick={copyToClipboard}
                                className="h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
                            >
                                {hasCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-zinc-400 text-center">
                            This link is valid for 7 days.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}