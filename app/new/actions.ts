"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { mapLinkRow } from "@/lib/links";
import type { LinkItem } from "@/lib/types";

type NewLinkInput = Omit<LinkItem, "id" | "createdAt">;

const LINK_COLUMNS =
  "id, url, title, description, thumbnail_url, folder_id, created_at";

/**
 * 새 링크를 links 테이블에 추가하고, 저장된 행을 돌려준다.
 */
export async function createLink(input: NewLinkInput): Promise<LinkItem> {
  const url = input.url.trim();
  if (!url) {
    throw new Error("링크 주소가 필요합니다.");
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("links")
    .insert({
      url,
      title: input.title.trim() || url,
      description: input.description.trim() || null,
      thumbnail_url: input.thumbnail || null,
      folder_id: input.folderId ? Number(input.folderId) : null,
    })
    .select(LINK_COLUMNS)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "링크를 추가하지 못했습니다.");
  }

  return mapLinkRow(data);
}
