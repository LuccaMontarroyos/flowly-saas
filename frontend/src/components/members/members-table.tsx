"use client";

import { User } from "@/services/users"; // Importe do service atualizado
import { UserRole } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { removeUser } from "@/services/users";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateRoleDialog } from "./update-role-dialog";

interface MembersTableProps {
    users: User[];
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    search: string;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
}

export function MembersTable({ users, meta, search, onSearchChange, onPageChange }: MembersTableProps) {

    const queryClient = useQueryClient();
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleRemove = async (user: User) => {
        if (!confirm(`Are you sure you want to remove ${user.name} from the workspace? This action cannot be undone.`)) return;

        try {
            await removeUser(user.id);
            toast.success("Member removed");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        } catch (error) {
            toast.error("Failed to remove member. You might not have permission.");
        }
    };

    const handleNext = () => {
        if (meta && meta.page < meta.totalPages) {
            onPageChange(meta.page + 1);
        }
    };

    const handlePrev = () => {
        if (meta && meta.page > 1) {
            onPageChange(meta.page - 1);
        }
    };

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <div className="relative max-w-md w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-zinc-400" size={18} />
                        </div>
                        <input
                            value={search}
                            onChange={(e) => {
                                onSearchChange(e.target.value);
                                onPageChange(1);
                            }}
                            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow shadow-sm"
                            placeholder="Search by name or email..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                            <thead className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">Added</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Avatar className="h-9 w-9 border border-zinc-100 dark:border-zinc-800">
                                                        <AvatarFallback className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-zinc-900 dark:text-white">{user.name}</div>
                                                        <div className="text-xs text-zinc-500 sm:hidden mt-0.5">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                                <div className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                            ${user.role === UserRole.ADMIN
                                                        ? 'bg-primary/10 text-primary border-primary/20'
                                                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                                                    }`}
                                                >
                                                    {user.role === UserRole.ADMIN ? 'Admin' : 'Member'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none">
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                                                        <DropdownMenuItem onClick={() => setEditingUser(user)} className="cursor-pointer">Edit Role</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer" onClick={() => handleRemove(user)}>Remove Member</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-zinc-500">
                                            No members found matching "{search}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {meta && (
                        <div className="bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between mt-auto">
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                Showing <span className="font-medium text-zinc-900 dark:text-white">{(meta.page - 1) * meta.limit + 1}</span> to <span className="font-medium text-zinc-900 dark:text-white">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium text-zinc-900 dark:text-white">{meta.total}</span> members
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrev}
                                    disabled={meta.page === 1}
                                    className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={meta.page === meta.totalPages}
                                    className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <UpdateRoleDialog
                user={editingUser}
                open={!!editingUser}
                onOpenChange={(open) => !open && setEditingUser(null)}
            />
        </>
    );
}