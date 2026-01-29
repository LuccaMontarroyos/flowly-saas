import { Priority } from "@/types";

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    [Priority.HIGH]: { 
      label: "HIGH", 
      bg: "bg-red-500", 
      text: "text-white",
      border: "border-red-600"
    },
    [Priority.MEDIUM]: { 
      label: "MEDIUM", 
      bg: "bg-amber-500", 
      text: "text-white", 
      border: "border-amber-600"
    },
    [Priority.LOW]: { 
      label: "LOW", 
      bg: "bg-slate-200 dark:bg-slate-700", 
      text: "text-slate-600 dark:text-slate-300", 
      border: "border-slate-300 dark:border-slate-600"
    },
  };
  
  const safePriority = priority || Priority.LOW;
  const style = config[safePriority] || config[Priority.LOW];

  return (
    <div 
      className={`
        relative flex items-center justify-center px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-sm border-l-2
        ${style.bg} ${style.text} ${style.border}
      `}
      style={{
        clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)",
        paddingRight: "12px"
      }}
    >
      {style.label}
    </div>
  );
}