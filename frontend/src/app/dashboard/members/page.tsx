"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCompanyUsers } from "@/services/users";
import { MembersTable } from "@/components/members/members-table";
import { InviteMemberDialog } from "@/components/members/invite-member-dialog";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";

export default function MembersPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, debouncedSearch],
    queryFn: () => getCompanyUsers(page, debouncedSearch),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-[1100px] w-full mx-auto px-8 py-10 flex flex-col flex-1">
        
            <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Organization Members</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-base">Manage who has access to your workspace and their permissions.</p>
                </div>
                <button 
                    onClick={() => setIsInviteOpen(true)}
                    className="flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-all shadow-sm shadow-primary/20"
                >
                    <Plus size={20} />
                    Invite Member
                </button>
            </header>

            <div className="flex-1">
                {isLoading ? (
                   <MembersSkeleton />
                ) : (
                    <MembersTable 
                        users={data?.data || []}
                        meta={data?.meta}
                        search={search}
                        onSearchChange={setSearch}
                        onPageChange={setPage}
                    />
                )}
            </div>

            <InviteMemberDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />
        </div>
    </div>
  );
}

function MembersSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-md rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
    )
}