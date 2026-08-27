import type { Folder, LinkItem } from "@/lib/types";
import LinkCard from "./LinkCard";

interface LinkGridProps {
  links: LinkItem[];
  folders: Folder[];
}

export default function LinkGrid({ links, folders }: LinkGridProps) {
  if (links.length === 0) {
    return (
      <div className="grid place-items-center rounded-xl border border-dashed border-zinc-300 py-20 text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
        저장된 링크가 없습니다.
      </div>
    );
  }

  const folderName = (id: string) => folders.find((f) => f.id === id)?.name;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          folderName={folderName(link.folderId)}
        />
      ))}
    </div>
  );
}
