import type { Folder, LinkItem } from "@/lib/types";
import LinkGrid from "./LinkGrid";

interface LinkSectionProps {
  title: string;
  links: LinkItem[];
  folders: Folder[];
}

/**
 * 인덱스 페이지와 폴더별 페이지가 공유하는 링크 목록 섹션.
 * 제목 + 링크 개수 + 그리드로 구성된다.
 */
export default function LinkSection({ title, links, folders }: LinkSectionProps) {
  return (
    <>
      <div className="mb-4 flex items-baseline gap-2">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <span className="text-sm text-zinc-400 dark:text-zinc-500">
          {links.length}개
        </span>
      </div>

      <LinkGrid links={links} folders={folders} />
    </>
  );
}
