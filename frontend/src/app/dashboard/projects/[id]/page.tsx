"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/services/projects";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  // Busca os dados APENAS do projeto (nome, descrição)
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
  });

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-zinc-950">
      {/* Header do Kanban */}
      <header className="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              {project.name}
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                Kanban
              </span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 max-w-md">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Avatares dos membros virão aqui */}
          <div className="flex -space-x-2 mr-4">
             <div className="size-8 rounded-full bg-zinc-200 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-xs">M</div>
             <div className="size-8 rounded-full bg-zinc-300 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-xs">A</div>
          </div>

          <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <MoreHorizontal size={20} />
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white h-9 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-all">
            <Plus size={16} /> New Task
          </button>
        </div>
      </header>

      {/* Área do Board (Scroll Horizontal) */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full p-6 flex items-start gap-6">
            {/* Aqui entrarão as colunas do Kanban */}
            <div className="w-80 shrink-0 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 h-full max-h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">To Do</span>
                    <span className="text-xs text-zinc-400 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">0</span>
                </div>
                <div className="flex-1 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
                    Drop items here
                </div>
            </div>

             <div className="w-80 shrink-0 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 h-full max-h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">In Progress</span>
                    <span className="text-xs text-zinc-400 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">0</span>
                </div>
            </div>

             <div className="w-80 shrink-0 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 h-full max-h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">Done</span>
                    <span className="text-xs text-zinc-400 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">0</span>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

function ProjectDetailsSkeleton() {
    return (
        <div className="flex flex-col h-full">
            <div className="h-16 border-b px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-8 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="p-6 flex gap-6 h-full">
                {[1, 2, 3].map(i => <Skeleton key={i} className="w-80 h-full rounded-xl" />)}
            </div>
        </div>
    )
}