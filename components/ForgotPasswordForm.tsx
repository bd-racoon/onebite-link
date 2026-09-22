"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import Toast from "./Toast";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // 중복 클릭 방지: 상태 반영을 기다리지 않고 즉시 재진입을 막는다.
  const submittingRef = useRef(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setToastMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    submittingRef.current = false;
    setSubmitting(false);

    if (error) {
      setToastMessage(translateAuthError(error.message));
      return;
    }

    setSent(true);
  };

  return (
    <>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <form onSubmit={handleSubmit} className="card flex flex-col gap-5 p-6">
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
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="field px-3 py-2 text-base"
          />
        </div>

        {sent ? (
          <p className="text-sm text-[var(--success)]">
            비밀번호 재설정 링크를 이메일로 보냈습니다. 이메일함을 확인해
            주세요.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={email === "" || submitting}
          className="btn-primary mt-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "발송 중…" : "재설정 링크 발송"}
        </button>

        <p className="text-center text-sm text-[var(--text-sub)]">
          <Link
            href="/login"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            로그인으로 돌아가기
          </Link>
        </p>
      </form>
    </>
  );
}
