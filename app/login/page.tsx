import type { Metadata } from "next";
import Link from "next/link";

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

        <form className="card flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[var(--text)]"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="field px-3 py-2 text-base"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--text)]"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="field px-3 py-2 text-base"
            />
          </div>

          <button
            type="submit"
            className="btn-primary mt-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium"
          >
            로그인
          </button>

          <p className="text-center text-sm text-[var(--text-sub)]">
            아직 계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
