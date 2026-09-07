"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { OpenGraphResult } from "@/app/api/og/route";
import { useFolders } from "./FoldersProvider";
import { useLinks } from "./LinksProvider";

export default function NewLinkForm() {
  const router = useRouter();
  const { folders } = useFolders();
  const { addLink } = useLinks();

  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 중복 클릭 방지: 상태 반영을 기다리지 않고 즉시 재진입을 막는다.
  const submittingRef = useRef(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
      const data = (await response.json()) as Partial<OpenGraphResult> & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "링크 정보를 불러오지 못했습니다.");
      }

      await addLink({
        url: data.url || url,
        title: data.title || url,
        description: data.description ?? "",
        thumbnail: data.image || undefined,
        folderId,
      });

      router.push(folderId ? `/folder/${folderId}` : "/");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "알 수 없는 오류가 발생했습니다.",
      );
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-xl p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="link-url"
            className="text-sm font-medium text-[var(--text)]"
          >
            링크
          </label>
          <input
            id="link-url"
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            className="field px-3 py-2 text-base"
          />
          <p className="text-xs text-[var(--text-sub)]">
            저장 시 페이지의 제목·설명·썸네일을 자동으로 수집합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="link-folder"
            className="text-sm font-medium text-[var(--text)]"
          >
            폴더
          </label>
          <select
            id="link-folder"
            required
            value={folderId}
            onChange={(event) => setFolderId(event.target.value)}
            className="field px-3 py-2 text-base"
          >
            <option value="" disabled>
              폴더를 선택해 주세요
            </option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <p className="text-sm text-[var(--error)]">{error}</p>
        ) : null}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary inline-flex items-center px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "저장 중…" : "저장"}
          </button>
          <Link
            href="/"
            className="btn-secondary inline-flex items-center px-4 py-2 text-sm font-medium"
          >
            취소
          </Link>
        </div>
      </div>
    </form>
  );
}
