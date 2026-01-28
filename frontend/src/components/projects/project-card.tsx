import { Project } from "@/types";
import { Folder, MoreHorizontal } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-border hover:border-primary/50 rounded-xl p-5 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col h-[200px]">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">
          <Folder size={20} />
        </div>
        <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="flex-1">
        <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description || "No description provided."}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <span>{project.taskCount} Tasks</span>
        </div>
        
        <div className="flex -space-x-2">
          <div className="size-6 rounded-full ring-2 ring-white dark:ring-zinc-900 bg-zinc-200 flex items-center justify-center text-[10px]">A</div>
        </div>
      </div>
    </div>
  );
}