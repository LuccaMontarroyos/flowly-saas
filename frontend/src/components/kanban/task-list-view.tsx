"use client";

import { Task, TaskStatus } from "@/types";
import { Loader, CheckCircle2, Circle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { updateTaskStatus } from "@/services/tasks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PriorityBadge } from "./priority-badge";

interface TaskListViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const StatusSelect = ({ task }: { task: Task }) => {
    const queryClient = useQueryClient();

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation();

        const newStatus = e.target.value as TaskStatus;

        try {
            await updateTaskStatus(task.id, newStatus);
            toast.success("Status updated");
            queryClient.invalidateQueries({ queryKey: ["tasks", task.projectId] });
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const config = {
        [TaskStatus.TODO]: { icon: Circle, color: "text-zinc-500", bg: "bg-zinc-100 dark:bg-zinc-800" },
        [TaskStatus.IN_PROGRESS]: { icon: Loader, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20" },
        [TaskStatus.DONE]: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
    };

    const { icon: Icon, color, bg } = config[task.status];

    return (
        <div className="relative group/status w-fit">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-[110px] ${bg} border border-transparent group-hover/status:border-zinc-300 dark:group-hover/status:border-zinc-700 transition-colors cursor-pointer`}>
                <Icon size={14} className={color} />
                <span className={`text-xs font-medium ${color} truncate`}>{task.status.replace("_", " ")}</span>
            </div>
            <select
                value={task.status}
                onChange={handleStatusChange}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.DONE}>Done</option>
            </select>
        </div>
    );
}

export function TaskListView({ tasks, onTaskClick }: TaskListViewProps) {
    if (tasks.length === 0) {
        return <div className="p-8 text-center text-zinc-500 text-sm">No tasks found.</div>
    }

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-xs uppercase text-zinc-500 font-medium">
                    <tr>
                        <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 w-[100px]">ID</th>
                        <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 w-[120px]">Priority</th>
                        <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Title</th>
                        <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 w-[150px]">Status</th>
                        <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 w-[150px]">Assignee</th>
                        <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 w-[120px]">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {tasks.map((task) => (
                        <tr
                            key={task.id}
                            onClick={() => onTaskClick(task)}
                            className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group"
                        >
                            <td className="px-6 py-4 text-xs font-mono text-zinc-400 group-hover:text-primary">
                                FLO-{task.id.slice(0, 4)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <PriorityBadge priority={task.priority} />
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{task.title}</span>
                            </td>
                            <td className="px-6 py-4">
                                <StatusSelect task={task} />
                            </td>
                            <td className="px-6 py-4">
                                {task.assignee ? (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-[10px]">{task.assignee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-zinc-600 dark:text-zinc-300">{task.assignee.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-zinc-400 italic">Unassigned</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-xs text-zinc-500">
                                {new Date(task.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}