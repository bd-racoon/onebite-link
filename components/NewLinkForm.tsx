"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Folder } from "@/lib/types";

interface NewLinkFormProps {
  folders: Folder[];
}

export default function NewLinkForm({ folders }: NewLinkFormProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI 단계이므로 실제 저장 없이 목록으로 이동
    router.push("/");
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

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            className="btn-primary inline-flex items-center px-4 py-2 text-sm font-medium"
          >
            저장
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
