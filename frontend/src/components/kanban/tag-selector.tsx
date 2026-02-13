"use client";

import { useState } from "react";
import { Plus, Tag as TagIcon, Check, Loader2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TagBadge } from "./tag-badge";
import { toast } from "sonner";
import { Tag } from "@/types";
import { createTag, deleteTag, getTags } from "@/services/tags";

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagToggle: (tagId: string) => void;
  companyId: string;
}

const COLORS = ["red", "blue", "green", "yellow", "purple", "gray"];

export function TagSelector({ selectedTags, onTagToggle, companyId }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("gray");
  const queryClient = useQueryClient();

  const { data: availableTags = [], isLoading } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: getTags,
    enabled: isOpen 
  });

  const createTagMutation = useMutation({
    mutationFn: async () => {
      const tag = await createTag({ name: newTagName, color: selectedColor });
      return tag;
    },
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setNewTagName("");
      onTagToggle(newTag.id); 
      toast.success("Tag created!");
    },
    onError: () => toast.error("Failed to create tag")
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      await deleteTag(tagId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); 
      toast.success("Tag deleted");
    },
    onError: () => toast.error("Failed to delete tag")
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    createTagMutation.mutate();
  };

  const handleDelete = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this tag? It will be removed from all tasks.")) {
        deleteTagMutation.mutate(tagId);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
        >
          <Plus size={14} /> Add Tag
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-72 p-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50" 
        align="start" 
        side="bottom"
        sideOffset={8}
      >
        <div className="flex flex-col">
            <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50">
                <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <TagIcon size={14} className="text-zinc-500" /> Manage Tags
                </h4>
            </div>

            <div className="p-2 max-h-[200px] overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950">
                {isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin text-zinc-400" size={16}/></div>
                ) : availableTags.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-4">No tags created yet.</p>
                ) : (
                    <div className="space-y-1">
                        {availableTags.map(tag => {
                            const isSelected = selectedTags.some(t => t.id === tag.id);
                            return (
                                <div 
                                    key={tag.id}
                                    className={`group flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => onTagToggle(tag.id)}
                                        className="flex-1 flex items-center justify-between text-left"
                                    >
                                        <TagBadge name={tag.name} color={tag.color} />
                                        {isSelected && <Check size={14} className="text-primary mr-2" />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => handleDelete(e, tag.id)}
                                        disabled={deleteTagMutation.isPending}
                                        className="text-zinc-400 hover:text-red-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete tag"
                                    >
                                        {deleteTagMutation.isPending && deleteTagMutation.variables === tag.id ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={12} />
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <form onSubmit={handleCreate} className="space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Create New</label>
                        <input 
                            placeholder="e.g. Bug, Feature..." 
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-zinc-900 dark:text-zinc-100"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {COLORS.map(color => (
                                <button
                                    type="button"
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${getBgColor(color)} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-zinc-400 dark:ring-offset-zinc-900 scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                                >
                                    {selectedColor === color && <Check size={10} className="text-white drop-shadow-md" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                        <button 
                            disabled={createTagMutation.isPending || !newTagName.trim()}
                            type="submit" 
                            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {createTagMutation.isPending ? "..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function getBgColor(color: string) {
    const map: any = {
        red: "bg-red-500", blue: "bg-blue-500", green: "bg-emerald-500", 
        yellow: "bg-amber-500", purple: "bg-purple-500", gray: "bg-zinc-500"
    };
    return map[color] || "bg-zinc-500";
}