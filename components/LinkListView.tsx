"use client";

import { useFolders } from "./FoldersProvider";
import { useLinks } from "./LinksProvider";
import LinkSection from "./LinkSection";

interface LinkListViewProps {
  /** 지정하면 해당 폴더의 링크만 보여준다. 없으면 전체 링크. */
  folderId?: string;
  /** 폴더를 못 찾거나 folderId가 없을 때 쓰는 제목. */
  fallbackTitle: string;
}

/**
 * 클라이언트 링크/폴더 상태를 읽어 링크 목록 섹션을 그린다.
 * 인덱스 페이지와 폴더별 페이지가 공유한다.
 */
export default function LinkListView({
  folderId,
  fallbackTitle,
}: LinkListViewProps) {
  const { folders } = useFolders();
  const { links } = useLinks();

  const visibleLinks = folderId
    ? links.filter((link) => link.folderId === folderId)
    : links;

  const title = folderId
    ? (folders.find((folder) => folder.id === folderId)?.name ?? fallbackTitle)
    : fallbackTitle;

  return <LinkSection title={title} links={visibleLinks} folders={folders} />;
}
