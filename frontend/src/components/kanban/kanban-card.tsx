"use client";

import { Task } from "@/types";
import { Flag, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Draggable } from "@hello-pangea/dnd";
import { PriorityBadge } from "./priority-badge";

interface KanbanCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

export function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          style={{ ...provided.draggableProps.style }}
          className={`
            group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 shadow-sm 
            hover:shadow-md hover:border-primary/40 cursor-grab active:cursor-grabbing flex flex-col gap-2 transition-all duration-200
            ${snapshot.isDragging ? "shadow-xl ring-2 ring-primary rotate-2 opacity-90" : ""}
          `}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-400 group-hover:text-primary transition-colors">
              FLO-{task.id.slice(0, 4)}
            </span>
            <PriorityBadge priority={task.priority} />
          </div>

          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
            {task.title}
          </h3>

          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-1.5">
              <span className="px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-[10px] text-zinc-500 font-medium">
                Task
              </span>
            </div>

            {task.assignee ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatarUrl || ""} />
                <AvatarFallback className="text-[10px]">{task.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                <User size={12} />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}