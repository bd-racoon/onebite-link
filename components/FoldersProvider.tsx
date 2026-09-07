"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Folder } from "@/lib/types";
import {
  createFolder,
  deleteFolder,
  updateFolderName,
} from "@/app/folder/actions";

interface FoldersContextValue {
  folders: Folder[];
  addFolder: (name: string) => Promise<void>;
  renameFolder: (id: string, name: string) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
}

const FoldersContext = createContext<FoldersContextValue | null>(null);

interface FoldersProviderProps {
  initialFolders: Folder[];
  children: ReactNode;
}

/**
 * 폴더 목록을 클라이언트 상태로 보관한다.
 * 초기값은 서버에서 folders 테이블을 읽어 주입받고,
 * 추가·이름 수정·삭제는 서버 액션으로 folders 테이블에 반영한 뒤 상태에 반영한다.
 */
export function FoldersProvider({
  initialFolders,
  children,
}: FoldersProviderProps) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);

  const addFolder = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const folder = await createFolder(trimmed);
    setFolders((prev) => [...prev, folder]);
  };

  const renameFolder = async (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const updated = await updateFolderName(id, trimmed);
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === updated.id ? { ...folder, name: updated.name } : folder,
      ),
    );
  };

  const removeFolder = async (id: string) => {
    await deleteFolder(id);
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
