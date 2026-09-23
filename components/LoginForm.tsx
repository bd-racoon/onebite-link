"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import Toast from "./Toast";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [kakaoLoading, setKakaoLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // 중복 클릭 방지: 상태 반영을 기다리지 않고 즉시 재진입을 막는다.
  const submittingRef = useRef(false);

  // 카카오 로그인은 리다이렉트로 이 페이지에 돌아온 뒤 URL의 인가 코드로
  // Supabase가 비동기로 세션을 만들어 준다. 세션이 만들어지면 홈으로 이동한다.
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/");
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const canSubmit = email !== "" && password !== "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setToastMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setToastMessage(translateAuthError(error.message));
      submittingRef.current = false;
      setSubmitting(false);
      return;
    }

    router.push("/");
  };

  const handleKakaoLogin = async () => {
    if (kakaoLoading || submittingRef.current) return;

    setKakaoLoading(true);
    setToastMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setToastMessage(translateAuthError(error.message));
      setKakaoLoading(false);
    }
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
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="field px-3 py-2 text-base"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="btn-primary mt-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "로그인 중…" : "로그인"}
        </button>

        <button
          type="button"
          onClick={handleKakaoLogin}
          disabled={kakaoLoading || submitting}
          aria-label="카카오로 로그인"
          className="overflow-hidden rounded-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image
            src="/kakao_login_large_wide.png"
            alt="카카오 로그인"
            width={600}
            height={90}
            className="h-auto w-full"
          />
        </button>

        <Link
          href="/forgot-password"
          className="text-center text-sm font-medium text-[var(--accent)] hover:underline"
        >
          비밀번호를 잊으셨나요?
        </Link>

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
    </>
  );
}
