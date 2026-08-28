import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";
import LinkListView from "@/components/LinkListView";
import { folders } from "@/lib/mock-data";

interface FolderPageProps {
  params: Promise<{ folderId: string }>;
}

export function generateStaticParams() {
  return folders.map((folder) => ({ folderId: folder.id }));
}

export async function generateMetadata({
  params,
}: FolderPageProps): Promise<Metadata> {
  const { folderId } = await params;
  const folder = folders.find((f) => f.id === folderId);

  return {
    title: folder ? `${folder.name} · 한입 링크` : "폴더를 찾을 수 없음",
  };
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  const folder = folders.find((f) => f.id === folderId);

  if (!folder) {
    notFound();
  }

  return (
    <AppShell sidebar={<Sidebar />}>
      <LinkListView folderId={folder.id} fallbackTitle={folder.name} />
    </AppShell>
  );
}
