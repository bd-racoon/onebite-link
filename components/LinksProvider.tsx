"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { LinkItem } from "@/lib/types";
import {
  createLink,
  deleteLink,
  updateLink as updateLinkAction,
} from "@/app/new/actions";

type NewLinkInput = Omit<LinkItem, "id" | "createdAt">;
type LinkPatch = Partial<Pick<LinkItem, "folderId" | "title" | "description">>;

interface LinksContextValue {
  links: LinkItem[];
  addLink: (link: NewLinkInput) => Promise<void>;
  updateLink: (id: string, patch: LinkPatch) => Promise<void>;
  removeLink: (id: string) => Promise<void>;
}

const LinksContext = createContext<LinksContextValue | null>(null);

interface LinksProviderProps {
  initialLinks: LinkItem[];
  children: ReactNode;
}

/**
 * 링크 목록을 클라이언트 상태로 보관한다.
 * 초기값은 서버에서 links 테이블을 읽어 주입받고,
 * 추가·수정·삭제는 서버 액션으로 links 테이블에 반영한 뒤 상태에 반영한다.
 */
export function LinksProvider({ initialLinks, children }: LinksProviderProps) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  const addLink = async (link: NewLinkInput) => {
    const created = await createLink(link);
    setLinks((prev) => [created, ...prev]);
  };

  const updateLink = async (id: string, patch: LinkPatch) => {
    const updated = await updateLinkAction(id, patch);
    setLinks((prev) =>
      prev.map((link) => (link.id === updated.id ? updated : link)),
    );
  };

  const removeLink = async (id: string) => {
    await deleteLink(id);
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  return (
    <LinksContext.Provider value={{ links, addLink, updateLink, removeLink }}>
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
