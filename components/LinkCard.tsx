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
      className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-100 text-xs font-bold uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {link.title.charAt(0)}
        </span>
        <span className="truncate text-xs text-zinc-400 dark:text-zinc-500">
          {hostname(link.url)}
        </span>
      </div>

      <h3 className="mt-3 line-clamp-1 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
        {link.title}
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
        {link.description}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
        {folderName ? (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {folderName}
          </span>
        ) : (
          <span />
        )}
        <time dateTime={link.createdAt}>{link.createdAt}</time>
      </div>
    </a>
  );
}
