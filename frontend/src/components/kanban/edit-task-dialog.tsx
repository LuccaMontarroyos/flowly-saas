"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash2, User, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask } from "@/services/tasks";
import { Task, TaskStatus, Priority, Tag } from "@/types";
import { useEffect } from "react";
import { editTaskSchema } from "@/modules/tasks/task.schema";
import { EditTaskForm } from "@/modules/tasks/task.types";
import { getCompanyUsers } from "@/services/users";
import { TaskComments } from "./task-comments";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@/components/ui/editor";
import { TaskAttachments } from "./task-attachments";
import { TagSelector } from "./tag-selector";
import { TagBadge } from "./tag-badge"; 
import { api } from "@/lib/api";

interface EditTaskDialogProps {
    task: Task | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<EditTaskForm>({
        resolver: zodResolver(editTaskSchema),
    });

    const currentTagsIds = watch("tags") || [];

    const { data: usersData } = useQuery({
        queryKey: ["users-list-all"],
        queryFn: () => getCompanyUsers(1, "", 50),
        staleTime: 1000 * 60 * 5,
    });

    const users = usersData?.data || [];

    const { data: allTags = [] } = useQuery<Tag[]>({
        queryKey: ["tags"],
        queryFn: async () => (await api.get("/tags")).data,
        enabled: open
    });

    const selectedTagsObjects = allTags.filter(tag => currentTagsIds.includes(tag.id));

    useEffect(() => {
        if (task && open) {
            reset({
                title: task.title,
                description: task.description || "",
                status: task.status,
                priority: task.priority,
                assigneeId: task.assigneeId || "",
                tags: task.tags ? task.tags.map(t => t.id) : [],
            });
        }
    }, [task, open, reset]);

    const handleTagToggle = (tagId: string) => {
        const current = watch("tags") || [];
        let newTags;
        if (current.includes(tagId)) {
            newTags = current.filter(id => id !== tagId);
        } else {
            newTags = [...current, tagId];
        }
        setValue("tags", newTags, { shouldDirty: true, shouldTouch: true });
    };

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
            <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 sm:max-w-[1100px] h-[90vh] flex flex-col overflow-hidden p-0 gap-0 shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-950">
                    <div className="flex justify-between items-center pr-8">
                        <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                            <span className="text-xs font-mono font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                FLO-{task.id.slice(0, 4).toUpperCase()}
                            </span>
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 h-full">
                    <div className="md:col-span-7 flex flex-col h-full overflow-hidden border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form id="edit-task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                
                                <div className="space-y-2">
                                    <input
                                        {...register("title")}
                                        className="w-full text-2xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder:text-zinc-300 text-zinc-900 dark:text-zinc-100 transition-colors"
                                        placeholder="Issue Title"
                                    />
                                    {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                                </div>

                                <div className="flex flex-wrap gap-3 items-center">
                                    <div className="relative group">
                                        <select {...register("status")} className="appearance-none bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium px-3 py-1.5 rounded-md pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-zinc-700 dark:text-zinc-200 border border-transparent">
                                            <option value={TaskStatus.TODO}>To Do</option>
                                            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                            <option value={TaskStatus.DONE}>Done</option>
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                    </div>

                                    <div className="relative group">
                                        <select {...register("priority")} className="appearance-none bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium px-3 py-1.5 rounded-md pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-zinc-700 dark:text-zinc-200 border border-transparent">
                                            <option value={Priority.LOW}>Low Priority</option>
                                            <option value={Priority.MEDIUM}>Medium Priority</option>
                                            <option value={Priority.HIGH}>High Priority</option>
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                    </div>

                                    <div className="relative group">
                                        <select {...register("assigneeId")} className="appearance-none bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium px-3 py-1.5 rounded-md pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-zinc-700 dark:text-zinc-200 border border-transparent">
                                            <option value="">Unassigned</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                        <User size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <TagSelector 
                                            selectedTags={selectedTagsObjects} 
                                            onTagToggle={handleTagToggle}
                                            companyId={task.companyId}
                                        />

                                        {selectedTagsObjects.map(tag => (
                                            <div key={tag.id} className="group relative">
                                                <TagBadge name={tag.name} color={tag.color} />
                                                <button
                                                    type="button" 
                                                    onClick={() => handleTagToggle(tag.id)}
                                                    className="absolute -top-1.5 -right-1.5 bg-zinc-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-sm cursor-pointer z-10"
                                                >
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</label>
                                    <div className="min-h-[200px] -mx-2">
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
                        </div>

                        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-zinc-900/30 backdrop-blur-sm shrink-0">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="text-zinc-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md flex items-center gap-2 text-xs font-medium"
                            >
                                <Trash2 size={14} /> Delete Task
                            </button>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => onOpenChange(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    form="edit-task-form"
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                                >
                                    {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-5 flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-900/20 overflow-hidden">
                        <div className="shrink-0 p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm max-h-[35%] overflow-y-auto custom-scrollbar">
                            <TaskAttachments taskId={task.id} />
                        </div>
                        <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
                            <TaskComments taskId={task.id} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}