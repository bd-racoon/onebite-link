import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "로그인 · 한입 링크",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--background)] px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <span className="flex items-baseline gap-1 text-2xl font-semibold tracking-tight text-[var(--text)]">
            <span className="text-[var(--accent)]">한입</span>
            <span>링크</span>
          </span>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
