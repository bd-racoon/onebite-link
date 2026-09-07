"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { mapLinkRow } from "@/lib/links";
import type { LinkItem } from "@/lib/types";

type NewLinkInput = Omit<LinkItem, "id" | "createdAt">;
type LinkPatch = Partial<Pick<LinkItem, "folderId" | "title" | "description">>;

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

/**
 * 링크의 변경된 필드(폴더·제목·설명)만 links 테이블에 업데이트하고,
 * 갱신된 행을 돌려준다.
 */
export async function updateLink(
  id: string,
  patch: LinkPatch,
): Promise<LinkItem> {
  const fields: Record<string, string | number | null> = {};

  if (patch.title !== undefined) {
    const title = patch.title.trim();
    if (!title) {
      throw new Error("제목을 입력해 주세요.");
    }
    fields.title = title;
  }
  if (patch.description !== undefined) {
    fields.description = patch.description.trim() || null;
  }
  if (patch.folderId !== undefined) {
    fields.folder_id = patch.folderId ? Number(patch.folderId) : null;
  }

  if (Object.keys(fields).length === 0) {
    throw new Error("변경할 내용이 없습니다.");
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("links")
    .update(fields)
    .eq("id", id)
    .select(LINK_COLUMNS)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "링크를 수정하지 못했습니다.");
  }

  return mapLinkRow(data);
}
