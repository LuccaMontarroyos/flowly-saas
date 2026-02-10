"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskAttachments, createAttachment, deleteAttachment } from "@/services/attachments";
import { UploadDropzone } from "@/lib/uploadthing";
import { Loader2, FileIcon, Trash2, Download, Paperclip, X, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

interface TaskAttachmentsProps {
    taskId: string;
}

export function TaskAttachments({ taskId }: TaskAttachmentsProps) {
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);

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
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <Paperclip size={14} className="text-zinc-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Attachments ({attachments?.length || 0})
                    </h3>
                </div>
                {!isUploading && (
                    <button
                        onClick={() => setIsUploading(true)}
                        className="text-[10px] bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-2.5 py-1.5 rounded-md transition-colors text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-1"
                    >
                        <CloudUpload size={12} /> Add File
                    </button>
                )}
                 {isUploading && (
                    <button
                        onClick={() => setIsUploading(false)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex items-center gap-1"
                    >
                        <X size={12} /> Cancel
                    </button>
                )}
            </div>

            {isUploading && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <UploadDropzone
                        endpoint="projectAttachment"
                        // @ts-ignore
                        url="http://localhost:3000/api/uploadthing"
                        onClientUploadComplete={async (res) => {
                            try {
                                if (res && res.length > 0) {
                                    const file = res[0];
                                    await createAttachment({
                                        taskId,
                                        name: file.name,
                                        url: file.ufsUrl || file.url,
                                        type: file.type || "application/octet-stream",
                                        size: file.size
                                    });
                                    queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
                                    toast.success("File attached successfully");
                                }
                            } catch (error) {
                                toast.error("Failed to save attachment info.");
                            } finally {
                                setIsUploading(false);
                            }
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(`Upload failed: ${error.message}`);
                            setIsUploading(false);
                        }}
                        appearance={{
                            container: `
                                border-dashed border-2 border-zinc-200 dark:border-zinc-700 
                                rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 
                                hover:bg-zinc-50 dark:hover:bg-zinc-900 
                                transition-all duration-200 ease-in-out
                                h-40 w-full flex flex-col justify-center items-center
                                cursor-pointer group
                            `,
                            label: "text-sm text-zinc-500 font-medium group-hover:text-primary transition-colors",
                            allowedContent: "text-[10px] text-zinc-400 mt-1",
                            button: `
                                bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg 
                                mt-4 hover:bg-primary/90 transition-all shadow-sm 
                                group-hover:shadow-md
                            `,
                        }}
                        content={{
                            label: "Drop files here or click to browse",
                            allowedContent: "Images, PDF, Text (Max 4MB)"
                        }}
                    />
                </div>
            )}

            <div className="flex flex-col gap-2">
                {isLoading ? (
                    <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-zinc-300" /></div>
                ) : attachments?.length === 0 && !isUploading ? (
                    <div className="text-center py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                        <p className="text-xs text-zinc-400 italic">No files attached yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {attachments?.map((file) => (
                            <div key={file.id} className="group flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="shrink-0 w-9 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden relative border border-zinc-200 dark:border-zinc-700">
                                        {file.type.startsWith("image/") ? (
                                            <Image src={file.url} alt={file.name} fill className="object-cover" />
                                        ) : (
                                            <FileIcon className="text-zinc-400" size={16} />
                                        )}
                                    </div>
                                    
                                    <div className="min-w-0 flex flex-col">
                                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 truncate max-w-[180px]" title={file.name}>
                                            {file.name}
                                        </p>
                                        <span className="text-[10px] text-zinc-400 font-medium">
                                            {formatSize(file.size)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                                    <a 
                                        href={file.url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                                        title="Download"
                                    >
                                        <Download size={14} />
                                    </a>
                                    <button 
                                        onClick={() => deleteMutation.mutate(file.id)}
                                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}