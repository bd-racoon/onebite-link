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
    <aside className="w-full shrink-0 sm:w-52">
      <nav className="flex flex-col gap-0.5">
        <SidebarItem
          href="/"
          label="All"
          count={totalCount}
          active={pathname === "/"}
        />

        <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wide text-[var(--text-sub)]">
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
      className="nav-item flex items-center justify-between px-3 py-1.5 text-sm font-medium"
    >
      <span className="truncate">{label}</span>
      <span className="badge ml-2 px-1.5 py-0.5 text-xs tabular-nums">
        {count}
      </span>
    </Link>
  );
}
