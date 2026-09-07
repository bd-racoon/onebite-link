import type { LinkItem } from "./types";

/** Supabase links 테이블 행 (필요한 컬럼만). */
export interface LinkRow {
  id: number | string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  folder_id: number | string | null;
  created_at: string;
}

/** DB 컬럼명을 앱에서 쓰는 LinkItem 형태로 변환한다. */
export function mapLinkRow(row: LinkRow): LinkItem {
  return {
    id: String(row.id),
    url: row.url,
    title: row.title ?? row.url,
    description: row.description ?? "",
    thumbnail: row.thumbnail_url ?? undefined,
    folderId: row.folder_id == null ? "" : String(row.folder_id),
    createdAt: row.created_at.slice(0, 10),
  };
}
