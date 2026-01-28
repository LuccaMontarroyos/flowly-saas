"use client";

import { Folder, LayoutGrid, LogOut, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: Folder, label: "Projects", href: "/dashboard" },
    { icon: Users, label: "Members", href: "/dashboard/members" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-border bg-white dark:bg-zinc-950 h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-white">
            <LayoutGrid size={18} />
          </div>
          <h1 className="text-foreground text-lg font-bold tracking-tight">Flowly</h1>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-foreground"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500">
            
            AD
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Admin User</p>
            <button 
              onClick={() => {
                localStorage.removeItem("flowly-token");
                window.location.href = "/auth/login";
              }}
              className="text-xs text-muted-foreground truncate hover:text-red-500 flex items-center gap-1"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}