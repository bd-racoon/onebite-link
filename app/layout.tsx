import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { FoldersProvider } from "@/components/FoldersProvider";
import { LinksProvider } from "@/components/LinksProvider";
import { mapLinkRow } from "@/lib/links";
import type { Folder, LinkItem } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "한입 링크",
  description: "북마크를 폴더로 정리하는 링크 저장 서비스",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인된 사용자가 없으면(로그인·회원가입 페이지 등) 폴더·링크를 아예 불러오지 않는다.
  const [{ data: folderRows }, { data: linkRows }] = user
    ? await Promise.all([
        supabase
          .from("folders")
          .select("id, name")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("links")
          .select(
            "id, url, title, description, thumbnail_url, folder_id, created_at",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ])
    : [{ data: [] }, { data: [] }];

  const initialFolders: Folder[] = (folderRows ?? []).map((row) => ({
    id: String(row.id),
    name: row.name,
  }));
  const initialLinks: LinkItem[] = (linkRows ?? []).map(mapLinkRow);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 로그인 계정이 바뀌면 key가 달라져 Provider가 통째로 리마운트되어
            이전 사용자의 데이터를 들고 있지 않고 처음부터 다시 불러온다. */}
        <FoldersProvider key={user?.id ?? "anon"} initialFolders={initialFolders}>
          <LinksProvider initialLinks={initialLinks}>{children}</LinksProvider>
        </FoldersProvider>
      </body>
    </html>
  );
}
