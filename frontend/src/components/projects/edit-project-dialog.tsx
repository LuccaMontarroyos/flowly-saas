"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Project } from "@/types";
import { useEffect } from "react";
import { updateProject } from "@/services/projects";
import { projectSchema } from "@/modules/projects/project.schema";
import { ProjectForm } from "@/modules/projects/project.types";

interface EditProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const queryClient = useQueryClient();
  
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
    }
  });

  useEffect(() => {
    if (open) {
        reset({
            name: project.name,
            description: project.description || "",
        });
    }
  }, [project, open, reset]);

  const onSubmit = async (data: ProjectForm) => {
    try {
      await updateProject(project.id, data);
      
      toast.success("Project updated successfully!");
      onOpenChange(false);
      
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      toast.error("Failed to update project");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 sm:max-w-[425px] shadow-xl z-50">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-100">Edit Project</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Make changes to your project here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Project Name</label>
            <input 
                {...register("name")} 
                className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Description</label>
            <textarea 
                {...register("description")} 
                className="flex min-h-[80px] w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
            />
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
                {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}