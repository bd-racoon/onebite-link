"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import Toast from "./Toast";

type SessionStatus = "loading" | "ready" | "invalid";

export default function ResetPasswordForm() {
  const router = useRouter();

  // 이메일의 재설정 링크를 타고 들어오면 Supabase가 URL의 토큰으로 복구 세션을
  // 비동기로 만들어 준다. 그 세션이 준비될 때까지는 폼을 보여줄 수 없다.
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // 중복 클릭 방지: 상태 반영을 기다리지 않고 즉시 재진입을 막는다.
  const submittingRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (active && event === "PASSWORD_RECOVERY") {
        setStatus("ready");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active && session) setStatus("ready");
    });

    // 링크가 유효하지 않아 복구 세션이 끝내 만들어지지 않는 경우를 위한 안전장치.
    const timeout = setTimeout(() => {
      if (active) {
        setStatus((current) => (current === "loading" ? "invalid" : current));
      }
    }, 3000);

    return () => {
      active = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const canSubmit = password !== "" && passwordConfirm !== "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    if (password !== passwordConfirm) {
      setToastMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setToastMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setToastMessage(translateAuthError(error.message));
      submittingRef.current = false;
      setSubmitting(false);
      return;
    }

    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="card p-6">
        <p className="text-center text-sm text-[var(--text-sub)]">
          링크를 확인하는 중…
        </p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="card flex flex-col gap-4 p-6">
        <p className="text-sm text-[var(--error)]">
          유효하지 않거나 만료된 링크입니다. 비밀번호 찾기를 다시 시도해
          주세요.
        </p>
        <Link
          href="/forgot-password"
          className="text-center text-sm font-medium text-[var(--accent)] hover:underline"
        >
          비밀번호 찾기로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <form onSubmit={handleSubmit} className="card flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[var(--text)]"
          >
            새 비밀번호
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="새 비밀번호를 입력하세요"
            className="field px-3 py-2 text-base"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password-confirm"
            className="text-sm font-medium text-[var(--text)]"
          >
            새 비밀번호 확인
          </label>
          <input
            id="password-confirm"
            type="password"
            required
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            placeholder="새 비밀번호를 다시 입력하세요"
            className="field px-3 py-2 text-base"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="btn-primary mt-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "변경 중…" : "비밀번호 변경"}
        </button>
      </form>
    </>
  );
}
