"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { Plus, Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { useDebounce } from "@/hooks/use-debounce";

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  const { data, isLoading } = useQuery({
    queryKey: ["projects", debouncedSearch], 
    queryFn: () => getProjects(1, 100, debouncedSearch),
  });

  return (
    <>
      <header className="flex-shrink-0 px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Projects</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage and track your team's initiatives</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white h-9 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-all shadow-sm"
          >
            <Plus size={16} /> New Project
          </button>
        </div>
      </header>

      <div className="flex-shrink-0 px-8 py-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-zinc-400" size={18} />
          </div>
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            placeholder="Search projects..." 
            type="text"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[1,2,3,4].map(i => (
               <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data.length === 0 && search !== "" ? (
                <div className="col-span-full text-center text-zinc-500 py-10">
                    No projects found matching "{search}"
                </div>
            ) : (
                data?.data.map((project) => (
                <ProjectCard key={project.id} project={project} />
                ))
            )}
            
            {!search && (
                <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="group relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary rounded-xl p-5 flex flex-col items-center justify-center h-[200px] transition-all bg-transparent hover:bg-primary/5 cursor-pointer"
                >
                <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                    <Plus className="text-zinc-400 group-hover:text-primary" size={24} />
                </div>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-primary transition-colors">Create new project</span>
                </button>
            )}
          </div>
        )}
      </div>

      <CreateProjectDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}