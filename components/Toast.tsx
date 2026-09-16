"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

/**
 * 화면 상단에 잠깐 떴다가 사라지는 오류 토스트.
 * message가 바뀔 때마다 타이머를 새로 잡고, 4초 뒤 자동으로 닫힌다.
 */
export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        role="alert"
        className="card flex items-center gap-3 px-4 py-3 text-sm text-[var(--error)] shadow-lg"
        style={{ borderColor: "var(--error)" }}
      >
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-[var(--text-sub)] transition-colors hover:text-[var(--text)]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
