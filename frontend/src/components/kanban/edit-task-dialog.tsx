"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask } from "@/services/tasks";
import { Task, TaskStatus, Priority } from "@/types";
import { useEffect } from "react";
import { editTaskSchema } from "@/modules/tasks/task.schema";
import { EditTaskForm } from "@/modules/tasks/task.types";
import { getCompanyUsers } from "@/services/users";
import { TaskComments } from "./task-comments";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@/components/ui/editor";
import { TaskAttachments } from "./task-attachments";

interface EditTaskDialogProps {
    task: Task | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<EditTaskForm>({
        resolver: zodResolver(editTaskSchema),
    });

    const { data: usersData } = useQuery({
        queryKey: ["users-list-all"],
        queryFn: () => getCompanyUsers(1, "", 50),
        staleTime: 1000 * 60 * 5,
    });

    const users = usersData?.data || [];

    useEffect(() => {
        if (task && open) {
            reset({
                title: task.title,
                description: task.description || "",
                status: task.status,
                priority: task.priority,
                assigneeId: task.assigneeId || "",
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
            <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 sm:max-w-[1000px] h-[95vh] sm:h-[85vh] flex flex-col overflow-hidden p-0 gap-0">
                <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <DialogTitle className="text-zinc-900 dark:text-zinc-100 flex justify-between items-center pr-8">
                        <span>Edit Task</span>
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded">
                            FLO-{task.id.slice(0, 4)}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-5 h-full">
                    <div className="md:col-span-3 flex flex-col h-full overflow-hidden p-6 border-b md:border-b-0">
                        <form id="edit-task-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 gap-6">
                            <div className="space-y-6 shrink-0">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Title</label>
                                    <input
                                        {...register("title")}
                                        className="flex h-11 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="Task title"
                                    />
                                    {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</label>
                                        <select
                                            {...register("status")}
                                            className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <option value={TaskStatus.TODO}>To Do</option>
                                            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                            <option value={TaskStatus.DONE}>Done</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</label>
                                        <select
                                            {...register("priority")}
                                            className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <option value={Priority.LOW}>Low</option>
                                            <option value={Priority.MEDIUM}>Medium</option>
                                            <option value={Priority.HIGH}>High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Assignee</label>
                                        <select
                                            {...register("assigneeId")}
                                            className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <option value="">Unassigned</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 min-h-0 space-y-2">
                                <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Description</label>

                                <div className="flex-1 min-h-0">
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <Editor
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                placeholder="Add a detailed description..."
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-between items-center w-full mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <Trash2 size={16} /> Delete
                            </button>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => onOpenChange(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    form="edit-task-form"
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-primary/20"
                                >
                                    {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 h-full bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden border-l border-zinc-100 dark:border-zinc-800 flex flex col">
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 max-h-[40%] overflow-y-auto custom-scrollbar">
                            <TaskAttachments taskId={task.id} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <TaskComments taskId={task.id} />
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}