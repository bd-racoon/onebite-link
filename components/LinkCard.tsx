import type { LinkItem } from "@/lib/types";

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
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-hover flex h-full flex-col p-4"
    >
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
  );
}
