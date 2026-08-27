import NewLinkButton from "./NewLinkButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a
          href="/"
          className="flex items-baseline gap-1 text-base font-semibold tracking-tight text-[var(--text)]"
        >
          <span className="text-[var(--accent)]">한입</span>
          <span>링크</span>
        </a>
        <NewLinkButton />
      </div>
    </header>
  );
}
