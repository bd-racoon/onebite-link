"use client";

import { useEffect, useState } from "react";

interface EditFolderDialogProps {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

/**
 * 폴더 이름을 수정하는 모달. 현재 이름으로 인풋이 채워진 채로 열린다.
 * 부모가 마운트/언마운트로 열고 닫으며(folder id를 key로 사용),
 * 배경 클릭·취소·ESC로 닫힌다.
 */
export default function EditFolderDialog({
  initialName,
  onSave,
  onCancel,
}: EditFolderDialogProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSave(name);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-folder-title"
        className="card w-full max-w-sm p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="edit-folder-title"
          className="text-lg font-semibold text-[var(--text)]"
        >
          폴더 이름 수정
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-folder-name"
              className="text-sm font-medium text-[var(--text)]"
            >
              폴더 이름
            </label>
            <input
              id="edit-folder-name"
              type="text"
              autoFocus
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field px-3 py-2 text-base"
            />
          </div>

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
              className="btn-primary inline-flex items-center px-4 py-2 text-sm font-medium"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
