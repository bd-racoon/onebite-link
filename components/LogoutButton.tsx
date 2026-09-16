"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  // 중복 클릭 방지: 상태 반영을 기다리지 않고 즉시 재진입을 막는다.
  const loggingOutRef = useRef(false);

  const handleLogout = async () => {
    if (loggingOutRef.current) return;

    loggingOutRef.current = true;
    setLoggingOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="nav-item flex w-full items-center gap-2 px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M3 4a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H5v10h4a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1V4Zm10.293 1.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L14.586 10H8a1 1 0 1 1 0-2h6.586l-1.293-1.293a1 1 0 0 1 0-1.414Z"
          clipRule="evenodd"
        />
      </svg>
      {loggingOut ? "로그아웃 중…" : "로그아웃"}
    </button>
  );
}
