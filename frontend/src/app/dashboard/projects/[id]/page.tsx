"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Plus, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TaskStatus } from "@/types";
import { CreateTaskDialog } from "@/components/kanban/create-task-dialog";
import { DragDropContext } from "@hello-pangea/dnd";
import { EditTaskDialog } from "@/components/kanban/edit-task-dialog";
import { TaskListView } from "@/components/kanban/task-list-view";
import { BoardFilters } from "@/components/kanban/board-filters";
import { useTaskBoard } from "@/hooks/use-task-board";

export default function ProjectDetailsPage() {
    const params = useParams();
    const projectId = params.id as string;

    const {
        project,
        isLoading,
        boardData,
        viewMode,
        setViewMode,
        search,
        setSearch,
        onlyMyTasks,
        setOnlyMyTasks,
        priorityFilter,
        setPriorityFilter,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        createTaskStatus,
        openCreateModal,
        handleAddFromColumn,
        selectedTask,
        setSelectedTask,
        handleTaskClick,
        onDragEnd,
        getAllTasks,
    } = useTaskBoard(projectId);

    if (isLoading) return <ProjectDetailsSkeleton />;
    if (!project) return <div>Project not found</div>;

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <header className="flex flex-col border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-10 shrink-0">
                <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
                        <span className="text-zinc-300">/</span>
                        <span className="text-zinc-900 dark:text-white font-medium flex items-center gap-2">
                            {project.name}
                        </span>
                    </div>
                </div>

                <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{project.name}</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{project.description || "Manage your project tasks"}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg h-9 items-center">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-3 h-7 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all
                        ${viewMode === "list" ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-900"}`}
                            >
                                <List size={14} /> List
                            </button>
                            <button
                                onClick={() => setViewMode("board")}
                                className={`px-3 h-7 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all
                        ${viewMode === "board" ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-900"}`}
                            >
                                <LayoutGrid size={14} /> Board
                            </button>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="h-9 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm shadow-primary/20"
                        >
                            <Plus size={18} /> New Issue
                        </button>
                    </div>
                </div>
            </header>
            <BoardFilters
                search={search}
                onSearchChange={setSearch}
                onlyMyTasks={onlyMyTasks}
                onOnlyMyTasksChange={setOnlyMyTasks}
                priority={priorityFilter}
                onPriorityChange={setPriorityFilter}
            />

            {viewMode === "board" && boardData ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                        <div className="flex h-full gap-6 min-w-max pb-4">
                            <KanbanColumn
                                status={TaskStatus.TODO}
                                tasks={boardData.TODO}
                                color="text-zinc-400"
                                onTaskClick={handleTaskClick}
                                onAddClick={handleAddFromColumn}
                            />
                            <KanbanColumn
                                status={TaskStatus.IN_PROGRESS}
                                tasks={boardData.IN_PROGRESS}
                                color="text-blue-500"
                                onTaskClick={handleTaskClick}
                                onAddClick={handleAddFromColumn}
                            />
                            <KanbanColumn
                                status={TaskStatus.DONE}
                                tasks={boardData.DONE}
                                color="text-emerald-500"
                                onTaskClick={handleTaskClick}
                                onAddClick={handleAddFromColumn}
                            />
                        </div>
                    </main>
                </DragDropContext>
            ) : (
                <main className="flex-1 overflow-auto p-6">
                    <TaskListView
                        tasks={getAllTasks()}
                        onTaskClick={handleTaskClick}
                    />
                </main>
            )}

            <CreateTaskDialog
                open={isCreateTaskOpen}
                onOpenChange={setIsCreateTaskOpen}
                projectId={projectId}
                defaultStatus={createTaskStatus}
            />
            <EditTaskDialog
                task={selectedTask}
                open={!!selectedTask}
                onOpenChange={(open) => !open && setSelectedTask(null)}
            />
        </div>
    );
}

function ProjectDetailsSkeleton() {
    return (
        <div className="flex flex-col h-full bg-zinc-50">
            <div className="h-32 border-b bg-white p-6">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="p-6 flex gap-6 h-full">
                {[1, 2, 3].map(i => <Skeleton key={i} className="w-80 h-full rounded-xl" />)}
            </div>
        </div>
    )
}