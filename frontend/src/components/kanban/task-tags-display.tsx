import { Tag } from "@/types";
import { cn } from "@/lib/utils";

const colorStyles: Record<string, string> = {
  red: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  yellow: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  purple: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  gray: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
};

interface TaskTagsDisplayProps {
  tags?: Tag[];
  maxTags?: number;
}

export function TaskTagsDisplay({ tags, maxTags = 3 }: TaskTagsDisplayProps) {
  if (!tags || tags.length === 0) return null;

  const displayTags = tags.slice(0, maxTags);
  const remaining = tags.length - maxTags;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {displayTags.map((tag) => {
        const style = colorStyles[tag.color] || colorStyles.gray;
        return (
          <span
            key={tag.id}
            className={cn(
              "px-1.5 py-0.5 rounded-[4px] border text-[9px] font-bold uppercase tracking-wide flex items-center justify-center h-5",
              style
            )}
          >
            {tag.name}
          </span>
        );
      })}
      {remaining > 0 && (
        <span className="px-1.5 py-0.5 rounded-[4px] border border-zinc-200 bg-zinc-50 text-zinc-500 text-[9px] font-bold h-5 flex items-center">
          +{remaining}
        </span>
      )}
    </div>
  );
}