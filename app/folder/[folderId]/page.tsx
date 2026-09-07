import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";
import LinkListView from "@/components/LinkListView";
import { createClient } from "@/utils/supabase/server";

interface FolderPageProps {
  params: Promise<{ folderId: string }>;
}

/** folders 테이블에서 해당 폴더를 찾는다. 없으면 null. */
async function getFolder(folderId: string) {
  if (!/^\d+$/.test(folderId)) return null;

  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("folders")
    .select("id, name")
    .eq("id", folderId)
    .maybeSingle();

  return data;
}

export async function generateMetadata({
  params,
}: FolderPageProps): Promise<Metadata> {
  const { folderId } = await params;
  const folder = await getFolder(folderId);

  return {
    title: folder ? `${folder.name} · 한입 링크` : "폴더를 찾을 수 없음",
  };
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  const folder = await getFolder(folderId);

  if (!folder) {
    notFound();
  }

  return (
    <AppShell sidebar={<Sidebar />}>
      <LinkListView folderId={String(folder.id)} fallbackTitle={folder.name} />
    </AppShell>
  );
}
