import Link from "next/link";

export default function NewLinkButton() {
  return (
    <Link
      href="/new"
      className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
      </svg>
      새 링크
    </Link>
  );
}
