"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask } from "@/services/tasks";
import { Task, TaskStatus } from "@/types";
import { useEffect } from "react";
import { editTaskSchema } from "@/modules/tasks/task.schema";
import { EditTaskForm } from "@/modules/tasks/task.types";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditTaskForm>({
    resolver: zodResolver(editTaskSchema),
  });

  useEffect(() => {
    if (task && open) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        assigneeId: task.assigneeId,
      });
    }
  }, [task, open, reset]);

  const onSubmit = async (data: EditTaskForm) => {
    if (!task) return;
    try {
      await updateTask(task.id, data);
      
      toast.success("Task updated");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["tasks", task.projectId] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm("Delete this task permanently?")) return;
    try {
      await deleteTask(task.id);
      toast.success("Task deleted");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["tasks", task.projectId] });
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-100 flex justify-between items-center pr-8">
            <span>Edit Task</span>
            <span className="text-xs font-mono text-zinc-400">FLO-{task.id.slice(0, 4)}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Title</label>
            <input 
                {...register("title")} 
                className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Description</label>
            <textarea 
                {...register("description")} 
                className="flex min-h-[120px] w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-y"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Status</label>
            <select
                {...register("status")}
                className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.DONE}>Done</option>
            </select>
          </div>

          {/* Assignee - PLACEHOLDER PARA FUTURO */}
          {/* Aqui você precisará de um useQuery para listar usuários da empresa e preencher um select */}
          {/* <div className="space-y-2">
                <label>Assignee</label>
                <select {...register("assigneeId")} className="...">
                    <option value="">Unassigned</option>
                    {users.map(u => <option value={u.id}>{u.name}</option>)}
                </select>
            </div> 
          */}

          <DialogFooter className="flex justify-between sm:justify-between items-center w-full mt-4">
            <button 
                type="button"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 p-2 rounded-md transition-colors"
            >
                <Trash2 size={18} />
            </button>

            <div className="flex gap-2">
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
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}