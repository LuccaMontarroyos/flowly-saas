"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { createTaskSchema } from "@/modules/tasks/task.schema";
import { CreateTaskForm } from "@/modules/tasks/task.types";
import { createTask } from "@/services/tasks";
import { TaskStatus } from "@/types";
import { useEffect } from "react";

import { getCompanyUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query"

interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    defaultStatus?: TaskStatus;
}

export function CreateTaskDialog({ open, onOpenChange, projectId, defaultStatus }: CreateTaskDialogProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateTaskForm>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: TaskStatus.TODO,
            assigneeId: ""
        }
    });

    const { data: users } = useQuery({
        queryKey: ["users"],
        queryFn: getCompanyUsers,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (open) {
            reset({
                title: "",
                description: "",
                status: defaultStatus || TaskStatus.TODO
            });
        }
    }, [open, defaultStatus, reset])

    const onSubmit = async (data: CreateTaskForm) => {
        try {
            await createTask(projectId, data);
            toast.success("Task created successfully!");
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        } catch (error) {
            toast.error("Failed to create task");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 sm:max-w-[500px] shadow-xl z-50">
                <DialogHeader>
                    <DialogTitle className="text-zinc-900 dark:text-zinc-100">Create New Issue</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Add a new task to your board.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Title</label>
                        <input
                            {...register("title")}
                            className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
                            placeholder="Ex: Fix login bug on mobile"
                        />
                        {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Description</label>
                        <textarea
                            {...register("description")}
                            className="flex min-h-[100px] w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
                            placeholder="Describe the issue in detail..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Initial Status</label>
                            <select
                                {...register("status")}
                                className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
                            >
                                <option value={TaskStatus.TODO}>To Do</option>
                                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                <option value={TaskStatus.DONE}>Done</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Assignee</label>
                            <select
                                {...register("assigneeId")}
                                className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
                            >
                                <option value="">Unassigned</option>
                                {users?.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                            {isSubmitting ? "Creating..." : "Create Issue"}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}