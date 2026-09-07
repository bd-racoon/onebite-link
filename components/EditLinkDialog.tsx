"use client";

import { useEffect, useRef, useState } from "react";
import type { LinkItem } from "@/lib/types";
import { useFolders } from "./FoldersProvider";

interface EditLinkDialogProps {
  link: LinkItem;
  onSave: (patch: {
    folderId: string;
    title: string;
    description: string;
  }) => void | Promise<void>;
  onCancel: () => void;
}

/**
 * 링크의 폴더·제목·설명만 수정하는 모달.
 * 부모가 마운트/언마운트로 열고 닫으며, 배경 클릭·취소·ESC로 닫힌다.
 * 저장은 비동기(links 테이블 업데이트)이므로 진행 중에는 중복 제출을 막는다.
 */
export default function EditLinkDialog({
  link,
  onSave,
  onCancel,
}: EditLinkDialogProps) {
  const { folders } = useFolders();
  const [folderId, setFolderId] = useState(link.folderId);
  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      await onSave({
        folderId,
        title: title.trim(),
        description: description.trim(),
      });
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "링크를 수정하지 못했습니다.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-link-title"
        className="card w-full max-w-md p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="edit-link-title"
          className="text-lg font-semibold text-[var(--text)]"
        >
          링크 수정
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-link-folder"
              className="text-sm font-medium text-[var(--text)]"
            >
              폴더
            </label>
            <select
              id="edit-link-folder"
              value={folderId}
              onChange={(event) => setFolderId(event.target.value)}
              className="field px-3 py-2 text-base"
            >
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-link-name"
              className="text-sm font-medium text-[var(--text)]"
            >
              제목
            </label>
            <input
              id="edit-link-name"
              type="text"
              required
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="field px-3 py-2 text-base"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-link-description"
              className="text-sm font-medium text-[var(--text)]"
            >
              설명
            </label>
            <textarea
              id="edit-link-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="field resize-none px-3 py-2 text-base"
            />
          </div>

          {error ? (
            <p className="text-sm text-[var(--error)]">{error}</p>
          ) : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary inline-flex items-center px-4 py-2 text-sm font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex items-center px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "저장 중…" : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
