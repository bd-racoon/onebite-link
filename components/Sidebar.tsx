"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Folder } from "@/lib/types";

interface SidebarProps {
  folders: Folder[];
  totalCount: number;
}

export default function Sidebar({ folders, totalCount }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 sm:w-56">
      <nav className="flex flex-col gap-1">
        <SidebarItem
          href="/"
          label="All"
          count={totalCount}
          active={pathname === "/"}
        />

        <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          폴더
        </p>

        {folders.map((folder) => (
          <SidebarItem
            key={folder.id}
            href={`/folder/${folder.id}`}
            label={folder.name}
            count={folder.linkCount}
            active={pathname === `/folder/${folder.id}`}
          />
        ))}
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  href: string;
  label: string;
  count: number;
  active: boolean;
}

function SidebarItem({ href, label, count, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`ml-2 rounded-full px-2 py-0.5 text-xs tabular-nums ${
          active
            ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200"
            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
