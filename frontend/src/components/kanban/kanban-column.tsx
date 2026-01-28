"use client";

import { Task, TaskStatus } from "@/types";
import { KanbanCard } from "./kanban-card";
import { Plus, Circle, CheckCircle2, Loader } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  color: string;
  onTaskClick: (task: Task) => void;
  onAddClick: (status: TaskStatus) => void;
}

const statusConfig = {
  [TaskStatus.TODO]: { label: "To Do", icon: Circle },
  [TaskStatus.IN_PROGRESS]: { label: "In Progress", icon: Loader },
  [TaskStatus.DONE]: { label: "Done", icon: CheckCircle2 },
};

export function KanbanColumn({ status, tasks, color, onTaskClick, onAddClick }: KanbanColumnProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex flex-col w-[320px] h-full shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Icon size={18} className={color} />
          <span className="text-zinc-700 dark:text-zinc-200 font-semibold text-sm">
            {config.label}
          </span>
          <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button onClick={() => onAddClick(status)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <Plus size={18} />
        </button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`
                flex flex-col gap-3 h-full overflow-y-auto pr-2 pb-4 transition-colors rounded-lg
                ${snapshot.isDraggingOver ? "bg-zinc-100/50 dark:bg-zinc-900/50" : ""}
            `}
          >
            {tasks.map((task, index) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                index={index} 
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}