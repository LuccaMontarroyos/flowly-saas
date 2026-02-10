"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskComments, createComment, deleteComment } from "@/services/comment";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, Trash2, MessageSquare, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCommentsProps {
    taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [content, setContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: comments, isLoading } = useQuery({
        queryKey: ["comments", taskId],
        queryFn: () => getTaskComments(taskId),
    });

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments]);

    const createMutation = useMutation({
        mutationFn: () => createComment(taskId, content),
        onSuccess: () => {
            setContent("");
            queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
        },
        onError: () => toast.error("Failed to post comment"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
            toast.success("Comment deleted");
        },
        onError: () => toast.error("Failed to delete comment"),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        createMutation.mutate();
    };

    const formatCommentDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        if (differenceInDays(now, date) < 7) {
            return formatDistanceToNow(date, { addSuffix: true });
        }
        return format(date, "MMM d, yyyy, h:mm a");
    };

    return (
        <div className="flex flex-col h-full border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 md:pl-0 pt-6 md:pt-0 bg-white dark:bg-zinc-950/50">
            <div className="flex items-center gap-2 mb-4 shrink-0 px-6 pt-6">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">
                    <MessageSquare size={16} />
                </div>
                <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Activity</h3>
                    <p className="text-xs text-zinc-500">Latest comments and updates</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 p-6 bg-transparent custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-zinc-400" /></div>
                ) : comments?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl m-2">
                        <MessageSquare className="text-zinc-300 mb-2" size={24} />
                        <p className="text-sm text-zinc-500 font-medium">No comments yet</p>
                        <p className="text-xs text-zinc-400">Be the first to say something!</p>
                    </div>
                ) : (
                    comments?.map((comment) => {
                        const isCurrentUser = currentUser?.id === comment.userId;
                        const isAdmin = currentUser?.role === "ADMIN";
                        const canDelete = isCurrentUser || isAdmin;

                        return (
                            <div key={comment.id} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <Avatar className="w-8 h-8 mt-1 shrink-0 border border-zinc-200 dark:border-zinc-800">
                                    <AvatarImage src={comment.user.avatarUrl || ""} />
                                    <AvatarFallback className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                                        {comment.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                {comment.user.name}
                                            </span>
                                            <span className="text-[10px] text-zinc-400">
                                                {formatCommentDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        {canDelete && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                        <MoreHorizontal size={14} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-32">
                                                    <DropdownMenuItem
                                                        onClick={() => deleteMutation.mutate(comment.id)}
                                                        className="text-red-600 focus:text-red-600 cursor-pointer text-xs"
                                                    >
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                    <div className={`
                                        p-3 rounded-2xl text-sm leading-relaxed shadow-sm border
                                        ${isCurrentUser
                                            ? "bg-blue-50/50 border-blue-100 text-zinc-800 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-zinc-200 rounded-tr-sm"
                                            : "bg-white border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 rounded-tl-sm"
                                        }
                                    `}>
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                <form onSubmit={handleSubmit} className="relative group/input">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full min-h-[44px] max-h-[120px] py-3 pl-4 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={createMutation.isPending || !content.trim()}
                        className="absolute right-2 top-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                        {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    </button>
                </form>
                <p className="text-[10px] text-zinc-400 mt-2 pl-1">
                    Press <kbd className="font-sans px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">Enter</kbd> to send
                </p>
            </div>
        </div>
    );
}