import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";
import NewLinkForm from "@/components/NewLinkForm";
import { folders, links } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "새 링크 · 한입 링크",
};

export default function NewLinkPage() {
  return (
    <AppShell
      sidebar={<Sidebar totalCount={links.length} />}
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-[var(--text)]">새 링크</h2>
        <p className="mt-1 text-sm text-[var(--text-sub)]">
          저장할 링크와 폴더를 선택하세요.
        </p>
      </div>

      <NewLinkForm folders={folders} />
    </AppShell>
  );
}
