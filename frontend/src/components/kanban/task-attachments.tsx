"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskAttachments, createAttachment, deleteAttachment } from "@/services/attachments";
import { UploadDropzone } from "@/lib/uploadthing";
import { Loader2, FileIcon, ImageIcon, Trash2, Download, Paperclip } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface TaskAttachmentsProps {
  taskId: string;
}

export function TaskAttachments({ taskId }: TaskAttachmentsProps) {
  const queryClient = useQueryClient();

  const { data: attachments, isLoading } = useQuery({
    queryKey: ["attachments", taskId],
    queryFn: () => getTaskAttachments(taskId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
      toast.success("File removed");
    },
    onError: () => toast.error("Failed to delete file"),
  });

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
         <Paperclip size={16} className="text-zinc-500" />
         <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Attachments</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {isLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-zinc-400" /></div>
        ) : attachments?.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">No files attached yet.</p>
        ) : (
            attachments?.map((file) => (
                <div key={file.id} className="group flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-primary/30 transition-colors">
                    <div className="shrink-0 w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                        {file.type.startsWith("image/") ? (
                            <Image src={file.url} alt={file.name} fill className="object-cover" />
                        ) : (
                            <FileIcon className="text-zinc-500" size={20} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate" title={file.name}>
                            {file.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                            {formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 text-zinc-400 hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                            title="Download / Open"
                        >
                            <Download size={14} />
                        </a>
                        <button 
                            onClick={() => deleteMutation.mutate(file.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                            title="Delete"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
      <div className="mt-4">
          <UploadDropzone
            endpoint="projectAttachment"
            onClientUploadComplete={async (res) => {
              if (res && res.length > 0) {
                 const file = res[0];
                 try {
                     await createAttachment({
                         taskId,
                         name: file.name,
                         url: file.ufsUrl || file.url,
                         type: file.type || "application/octet-stream",
                         size: file.size
                     });
                     queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
                     toast.success("File attached successfully!");
                 } catch (error) {
                     toast.error("Failed to save attachment info.");
                 }
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
            appearance={{
                container: "border-dashed border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors h-32 flex flex-col justify-center items-center cursor-pointer",
                label: "text-xs text-zinc-500 hover:text-primary mt-2",
                button: "bg-primary text-white text-xs px-3 py-1.5 rounded mt-2 hover:bg-primary/90",
                allowedContent: "text-[10px] text-zinc-400"
            }}
          />
      </div>
    </div>
  );
}