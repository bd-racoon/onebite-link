"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Folder } from "@/lib/types";

/**
 * 새 폴더를 folders 테이블에 추가하고, 저장된 행을 돌려준다.
 */
export async function createFolder(name: string): Promise<Folder> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("폴더 이름을 입력해 주세요.");
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("folders")
    .insert({ name: trimmed })
    .select("id, name")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "폴더를 추가하지 못했습니다.");
  }

  return { id: String(data.id), name: data.name };
}

/**
 * folders 테이블의 폴더 이름을 수정하고, 갱신된 행을 돌려준다.
 */
export async function updateFolderName(
  id: string,
  name: string,
): Promise<Folder> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("폴더 이름을 입력해 주세요.");
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("folders")
    .update({ name: trimmed })
    .eq("id", id)
    .select("id, name")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "폴더 이름을 수정하지 못했습니다.");
  }

  return { id: String(data.id), name: data.name };
}

/**
 * folders 테이블에서 폴더를 삭제한다.
 * links.folder_id 는 FK가 ON DELETE SET NULL 이라 자동으로 비워진다.
 */
export async function deleteFolder(id: string): Promise<void> {
  const supabase = createClient(await cookies());
  const { error } = await supabase.from("folders").delete().eq("id", id);

  if (error) {
    throw new Error(error.message ?? "폴더를 삭제하지 못했습니다.");
  }
}
