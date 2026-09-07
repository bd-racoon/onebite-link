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
