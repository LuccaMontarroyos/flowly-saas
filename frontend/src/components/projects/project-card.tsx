"use client";

import { Project } from "@/types";
import { Folder, MoreHorizontal, Trash2, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { deleteProject } from "@/services/projects";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(project.id);
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 rounded-xl p-5 transition-all duration-200 hover:shadow-md flex flex-col h-[200px] overflow-hidden">

        <div className="flex justify-between items-start mb-3 shrink-0">
          <Link href={`/dashboard/projects/${project.id}`}>
            <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <Folder size={20} />
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none">
                <MoreHorizontal size={20} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 w-48"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />

              <Link href={`/dashboard/projects/${project.id}`}>
                <DropdownMenuItem className="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800">
                  <Eye className="mr-2 h-4 w-4 text-zinc-500" /> View Board
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditOpen(true);
                }}
                className="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800"
              >
                <Pencil className="mr-2 h-4 w-4 text-zinc-500" /> Edit Project
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />

              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link href={`/dashboard/projects/${project.id}`} className="flex-1 min-h-0 flex flex-col">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-primary transition-colors truncate">
            {project.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {project.description || "No description provided."}
          </p>

        </Link>
        <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            <span>{project.taskCount} Tasks</span>
          </div>
          <div className="flex -space-x-2">
            {project.owner && (
              <Avatar className="size-6 ring-2 ring-white dark:ring-zinc-900">
                <AvatarImage src={project.owner.avatarUrl || ""} />
                <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500">
                  {project.owner.name?.charAt(0).toUpperCase() || "O"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>

      <EditProjectDialog
        project={project}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}