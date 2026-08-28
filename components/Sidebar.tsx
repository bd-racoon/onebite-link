"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Folder } from "@/lib/types";
import { useFolders } from "./FoldersProvider";
import { useLinks } from "./LinksProvider";
import ConfirmDialog from "./ConfirmDialog";
import EditFolderDialog from "./EditFolderDialog";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { folders, renameFolder, removeFolder } = useFolders();
  const { links } = useLinks();
  const [pendingEdit, setPendingEdit] = useState<Folder | null>(null);
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
          count={links.length}
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
            count={links.filter((link) => link.folderId === folder.id).length}
            active={pathname === `/folder/${folder.id}`}
            onEdit={() => setPendingEdit(folder)}
            onDelete={() => setPendingDelete(folder)}
          />
        ))}
      </nav>

      {pendingEdit && (
        <EditFolderDialog
          key={pendingEdit.id}
          initialName={pendingEdit.name}
          onSave={(name) => {
            renameFolder(pendingEdit.id, name);
            setPendingEdit(null);
          }}
          onCancel={() => setPendingEdit(null)}
        />
      )}

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
  onEdit?: () => void;
  onDelete?: () => void;
}

function SidebarItem({
  href,
  label,
  count,
  active,
  onEdit,
  onDelete,
}: SidebarItemProps) {
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

  if (!onEdit && !onDelete) return link;

  return (
    <div className="folder-row relative">
      {link}
      <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`${label} 폴더 수정`}
            className="folder-action inline-flex items-center justify-center p-1"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
            >
              <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-8.379 8.379a2 2 0 0 1-.878.506l-3.216.804a.5.5 0 0 1-.606-.606l.804-3.216a2 2 0 0 1 .506-.878l8.379-8.379Zm2.121.707a1 1 0 0 0-1.414 0l-.94.94 1.414 1.414.94-.94a1 1 0 0 0 0-1.414Z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`${label} 폴더 삭제`}
            className="folder-action folder-action-danger inline-flex items-center justify-center p-1"
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
        )}
      </div>
    </div>
  );
}
