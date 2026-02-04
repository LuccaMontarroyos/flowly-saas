"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskComments, createComment, deleteComment } from "@/services/comment";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, Trash2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDate, formatDistanceToNow } from "date-fns";

interface TaskCommentsProps {
  taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getTaskComments(taskId),
  });

  const createMutation = useMutation({
    mutationFn: () => createComment(taskId, content),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      toast.success("Comment added");
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

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createMutation.mutate();
  };

  return (
    <div className="flex flex-col h-full border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 md:pl-6 pt-6 md:pt-0">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} className="text-zinc-500" />
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Activity</h3>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 min-h-[200px] max-h-[400px] pr-2 mb-4">
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="animate-spin text-zinc-400" /></div>
        ) : comments?.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-8 italic">No comments yet.</p>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} className="group flex gap-3 items-start">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {comment.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                    {comment.user.name}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg rounded-tl-none text-sm text-zinc-600 dark:text-zinc-300 mt-1 relative group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/80 transition-colors">
                  {comment.content}
                  {(currentUser?.id === comment.userId || currentUser?.role === "ADMIN") && (
                    <button
                      onClick={() => deleteMutation.mutate(comment.id)}
                      className="absolute right-2 top-2 opacity-0 group-hover/item:opacity-100 text-zinc-400 hover:text-red-500 transition-all"
                      title="Delete comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="relative mt-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full min-h-[80px] p-3 pr-12 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
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
          className="absolute bottom-3 right-3 p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:bg-zinc-300 transition-colors"
        >
          {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
}