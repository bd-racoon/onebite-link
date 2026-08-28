"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { LinkItem } from "@/lib/types";

type NewLinkInput = Omit<LinkItem, "id" | "createdAt">;

interface LinksContextValue {
  links: LinkItem[];
  addLink: (link: NewLinkInput) => void;
  removeLink: (id: string) => void;
}

const LinksContext = createContext<LinksContextValue | null>(null);

interface LinksProviderProps {
  initialLinks: LinkItem[];
  children: ReactNode;
}

/**
 * 링크 목록을 클라이언트 상태로 보관한다.
 * UI 단계라 실제 저장소는 없고, 초기값은 서버에서 목 데이터로 주입받는다.
 */
export function LinksProvider({ initialLinks, children }: LinksProviderProps) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  const addLink = (link: NewLinkInput) => {
    setLinks((prev) => [
      {
        ...link,
        id: `link-${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const removeLink = (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  return (
    <LinksContext.Provider value={{ links, addLink, removeLink }}>
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (!context) {
    throw new Error("useLinks는 LinksProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
