import type { ReactNode } from "react";
import Header from "./Header";

interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="min-h-full flex-1 bg-[var(--background)]">
      <Header />
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 sm:flex-row">
        {sidebar}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
