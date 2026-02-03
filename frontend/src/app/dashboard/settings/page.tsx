"use client";

import { Construction } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full mb-4">
        <Construction size={32} className="text-zinc-400" />
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Settings</h2>
      <p className="text-zinc-500 max-w-sm mt-2">
        We are putting the finishing touches on the account settings. Check back soon!
      </p>
    </div>
  );
}