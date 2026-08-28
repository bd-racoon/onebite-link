"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Folder } from "@/lib/types";
import { useFolders } from "./FoldersProvider";
import ConfirmDialog from "./ConfirmDialog";

interface SidebarProps {
  totalCount: number;
}

export default function Sidebar({ totalCount }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { folders, removeFolder } = useFolders();
  const [pendingDelete, setPendingDelete] = useState<Folder | null>(null);

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    removeFolder(pendingDelete.id);
    if (pathname === `/folder/${pendingDelete.id}`) {
      router.push("/");
    }
    setPendingDelete(null);
  };

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
            onDelete={() => setPendingDelete(folder)}
          />
        ))}
      </nav>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="폴더 삭제"
        description={
          pendingDelete
            ? `'${pendingDelete.name}' 폴더를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`
            : ""
        }
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </aside>
  );
}

interface SidebarItemProps {
  href: string;
  label: string;
  count: number;
  active: boolean;
  onDelete?: () => void;
}

function SidebarItem({ href, label, count, active, onDelete }: SidebarItemProps) {
  const link = (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="nav-item flex items-center justify-between px-3 py-1.5 text-sm font-medium"
    >
      <span className="truncate">{label}</span>
      <span className="badge folder-count ml-2 px-1.5 py-0.5 text-xs tabular-nums">
        {count}
      </span>
    </Link>
  );

  if (!onDelete) return link;

  return (
    <div className="folder-row relative">
      {link}
      <button
        type="button"
        onClick={onDelete}
        aria-label={`${label} 폴더 삭제`}
        className="folder-delete absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center p-1"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
        >
          <path d="M8 3a1 1 0 0 0-1 1v1H4a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2h-3V4a1 1 0 0 0-1-1H8Z" />
          <path
            fillRule="evenodd"
            d="M6 8h8l-.62 7.45A2 2 0 0 1 11.39 17H8.61a2 2 0 0 1-1.99-1.55L6 8Zm3 1.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 9 9.75Zm2.75.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
