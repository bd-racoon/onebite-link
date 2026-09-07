import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { FoldersProvider } from "@/components/FoldersProvider";
import { LinksProvider } from "@/components/LinksProvider";
import { links } from "@/lib/mock-data";
import type { Folder } from "@/lib/types";
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
  const { data: folderRows } = await supabase
    .from("folders")
    .select("id, name")
    .order("created_at", { ascending: true });

  const initialFolders: Folder[] = (folderRows ?? []).map((row) => ({
    id: String(row.id),
    name: row.name,
  }));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FoldersProvider initialFolders={initialFolders}>
          <LinksProvider initialLinks={links}>{children}</LinksProvider>
        </FoldersProvider>
      </body>
    </html>
  );
}
