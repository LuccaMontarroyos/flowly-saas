"use client";

import { Search, User, FilterX } from "lucide-react";
import { Priority } from "@/types";

interface BoardFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    onlyMyTasks: boolean;
    onOnlyMyTasksChange: (checked: boolean) => void;
    priority: string;
    onPriorityChange: (value: string) => void;
}

export function BoardFilters({
    search, onSearchChange,
    onlyMyTasks, onOnlyMyTasksChange,
    priority, onPriorityChange
}: BoardFiltersProps) {

    const hasActiveFilters = search || onlyMyTasks || priority !== "ALL";

    const clearFilters = () => {
        onSearchChange("");
        onOnlyMyTasksChange(false);
        onPriorityChange("ALL");
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4 px-6 pt-4 shrink-0">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                <input
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                <button
                    onClick={() => onOnlyMyTasksChange(!onlyMyTasks)}
                    className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border
                        ${onlyMyTasks
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }
                    `}
                >
                    <User size={16} />
                    My Tasks
                </button>
                <div className="relative">
                    <select
                        value={priority}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        className="appearance-none h-10 pl-3 pr-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <option value="ALL">All Priorities</option>
                        <option value={Priority.HIGH}>High Priority</option>
                        <option value={Priority.MEDIUM}>Medium Priority</option>
                        <option value={Priority.LOW}>Low Priority</option>
                    </select>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Clear filters"
                    >
                        <FilterX size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}