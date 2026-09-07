"use client";

import { useEffect, useRef, useState } from "react";
import { useFolders } from "./FoldersProvider";

export default function NewFolderButton() {
  const { addFolder } = useFolders();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 중복 클릭 방지: 상태 업데이트를 기다리지 않고 즉시 재진입을 막는다.
  const submittingRef = useRef(false);

  const close = () => {
    setOpen(false);
    setName("");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      await addFolder(trimmed);
      close();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "폴더를 추가하지 못했습니다.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
        >
          <path d="M3 6a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59l1.41 1.41H16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Zm7 2a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1H8a1 1 0 1 1 0-2h1V9a1 1 0 0 1 1-1Z" />
        </svg>
        새 폴더
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-folder-title"
            className="card w-full max-w-sm p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="new-folder-title"
              className="text-lg font-semibold text-[var(--text)]"
            >
              새 폴더
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="new-folder-name"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  폴더 이름
                </label>
                <input
                  id="new-folder-name"
                  type="text"
                  autoFocus
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="예: 아이디어"
                  className="field px-3 py-2 text-base"
                />
              </div>

              {error ? (
                <p className="text-sm text-[var(--error)]">{error}</p>
              ) : null}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={close}
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
      )}
    </>
  );
}
