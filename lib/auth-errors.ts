/** Supabase Auth가 돌려주는 영문 오류 메시지를 한국어 안내 문구로 옮긴다. */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "Email not confirmed": "이메일 인증이 완료되지 않았습니다.",
  "Too many requests": "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
};

export function translateAuthError(message: string): string {
  return AUTH_ERROR_MESSAGES[message] ?? "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.";
}
