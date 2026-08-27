import NewLinkButton from "./NewLinkButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="/"
          className="flex items-baseline gap-1 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          <span className="text-blue-600 dark:text-blue-400">한입</span>
          <span>링크</span>
        </a>
        <NewLinkButton />
      </div>
    </header>
  );
}
