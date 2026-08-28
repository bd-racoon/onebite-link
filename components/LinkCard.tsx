"use client";

import { useState } from "react";
import type { LinkItem } from "@/lib/types";
import { useLinks } from "./LinksProvider";
import ConfirmDialog from "./ConfirmDialog";

interface LinkCardProps {
  link: LinkItem;
  folderName?: string;
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function LinkCard({ link, folderName }: LinkCardProps) {
  const { removeLink } = useLinks();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="link-card relative h-full">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card card-hover flex h-full flex-col overflow-hidden p-4"
      >
        {link.thumbnail ? (
          <div className="mb-3 aspect-[1.91/1] w-full overflow-hidden rounded-md bg-[var(--hover-bg)]">
            {/* OG 썸네일은 임의 도메인이라 next/image 대신 일반 img 사용 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={link.thumbnail}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <span className="badge grid size-7 shrink-0 place-items-center text-xs font-bold uppercase">
            {link.title.charAt(0)}
          </span>
          <span className="truncate text-sm text-[var(--text-sub)]">
            {hostname(link.url)}
          </span>
        </div>

        <h3 className="card-title mt-3 line-clamp-1 text-base font-semibold text-[var(--text)]">
          {link.title}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-[var(--text-sub)]">
          {link.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-sub)]">
          {folderName ? (
            <span className="badge px-2 py-0.5 font-medium">{folderName}</span>
          ) : (
            <span />
          )}
          <time dateTime={link.createdAt}>{link.createdAt}</time>
        </div>
      </a>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`${link.title} 링크 삭제`}
        className="link-card-delete absolute right-2 top-2 inline-flex items-center justify-center rounded-md p-1.5"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
        >
          <path d="M8 3a1 1 0 0 0-1 1v1H4a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2h-3V4a1 1 0 0 0-1-1H8Z" />
          <path
            fillRule="evenodd"
            d="M6 8h8l-.62 7.45A2 2 0 0 1 11.39 17H8.61a2 2 0 0 1-1.99-1.55L6 8Zm3 1.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 9 9.75Zm2.75.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <ConfirmDialog
        open={confirming}
        title="링크 삭제"
        description={`'${link.title}' 링크를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={() => {
          removeLink(link.id);
          setConfirming(false);
        }}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
