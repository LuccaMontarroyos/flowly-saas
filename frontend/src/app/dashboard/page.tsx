"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/dashboard";
import { useAuth } from "@/hooks/use-auth";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import {
    Briefcase,
    CheckCircle2,
    Users,
    ArrowRight,
    Layout,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskStatus, Priority } from "@/types";

export default function DashboardPage() {
    const { user } = useAuth();

    const { data: stats, isLoading } = useQuery({
        queryKey: ["dashboard-stats", user?.companyId],
        queryFn: getDashboardStats,
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.companyId
    });

    const chartData = stats ? [
        { name: "To Do", total: stats.tasksDistribution[TaskStatus.TODO] || 0, color: "#94a3b8" },
        { name: "In Progress", total: stats.tasksDistribution[TaskStatus.IN_PROGRESS] || 0, color: "#5b2bee" },
        { name: "Done", total: stats.tasksDistribution[TaskStatus.DONE] || 0, color: "#5b2bee" },
    ] : [];

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        Hello, {user?.name.split(" ")[0]}!
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Here's what's happening with your projects today.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Total Projects"
                        total={stats?.overview.totalProjects || 0}
                        icon={Briefcase}
                        color="text-primary"
                        bg="bg-primary/10 dark:bg-primary/20"
                    />
                    <StatCard
                        title="Total Tasks"
                        total={stats?.overview.totalTasks || 0}
                        icon={CheckCircle2}
                        color="text-primary"
                        bg="bg-primary/10 dark:bg-primary/20"
                    />
                    <StatCard
                        title="Team Members"
                        total={stats?.overview.totalMembers || 0}
                        icon={Users}
                        color="text-primary"
                        bg="bg-primary/10 dark:bg-primary/20"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Task Status Distribution</h3>
                        <div className="h-[300px] w-full">
                            {stats?.overview.totalTasks === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                                    <Layout size={32} className="mb-2 opacity-50" />
                                    <p>No tasks data yet</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.1} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#71717a', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#71717a', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={50}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">My Priorities</h3>
                            <Link href="/dashboard/projects" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="flex-1 space-y-4">
                            {stats?.myRecentTasks.length === 0 ? (
                                <div className="text-sm text-zinc-500 text-center py-10">
                                    You have no pending tasks assigned.
                                </div>
                            ) : (
                                stats?.myRecentTasks.map(task => (
                                    <div key={task.id} className="group flex items-start justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1">{task.title}</p>
                                            <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                                                {task.project.name}
                                            </p>
                                        </div>
                                        <PriorityBadge priority={task.priority} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function StatCard({ title, total, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg} ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{total}</h2>
            </div>
        </div>
    )
}

function PriorityBadge({ priority }: { priority: Priority }) {
    const colors = {
        [Priority.HIGH]: "bg-primary/20 text-primary border-primary/30 dark:bg-primary/30 dark:text-primary dark:border-primary/40",
        [Priority.MEDIUM]: "bg-primary/15 text-primary border-primary/25 dark:bg-primary/25 dark:text-primary dark:border-primary/35",
        [Priority.LOW]: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30",
    };

    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[priority]} uppercase tracking-wider`}>
            {priority}
        </span>
    );
}

function DashboardSkeleton() {
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-80 rounded-xl lg:col-span-2" />
                <Skeleton className="h-80 rounded-xl" />
            </div>
        </div>
    )
}