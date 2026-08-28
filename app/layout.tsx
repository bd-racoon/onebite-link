import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FoldersProvider } from "@/components/FoldersProvider";
import { LinksProvider } from "@/components/LinksProvider";
import { folders, links } from "@/lib/mock-data";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FoldersProvider initialFolders={folders}>
          <LinksProvider initialLinks={links}>{children}</LinksProvider>
        </FoldersProvider>
      </body>
    </html>
  );
}
