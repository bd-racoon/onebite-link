"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Folder } from "@/lib/types";

interface FoldersContextValue {
  folders: Folder[];
  addFolder: (name: string) => void;
  renameFolder: (id: string, name: string) => void;
  removeFolder: (id: string) => void;
}

const FoldersContext = createContext<FoldersContextValue | null>(null);

interface FoldersProviderProps {
  initialFolders: Folder[];
  children: ReactNode;
}

/**
 * 폴더 목록을 클라이언트 상태로 보관한다.
 * UI 단계라 실제 저장소는 없고, 초기값은 서버에서 목 데이터로 주입받는다.
 */
export function FoldersProvider({
  initialFolders,
  children,
}: FoldersProviderProps) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);

  const addFolder = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setFolders((prev) => [
      ...prev,
      { id: `folder-${Date.now()}`, name: trimmed, linkCount: 0 },
    ]);
  };

  const renameFolder = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, name: trimmed } : folder,
      ),
    );
  };

  const removeFolder = (id: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
  };

  return (
    <FoldersContext.Provider
      value={{ folders, addFolder, renameFolder, removeFolder }}
    >
      {children}
    </FoldersContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FoldersContext);
  if (!context) {
    throw new Error("useFolders는 FoldersProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
