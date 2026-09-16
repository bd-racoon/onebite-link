import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/proxy";

/** 로그인한 사용자만 접근할 수 있는 페이지: 인덱스, 폴더별 페이지, 새 링크 페이지 */
function isProtectedPath(pathname: string) {
  return pathname === "/" || pathname === "/new" || pathname.startsWith("/folder/");
}

export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);

  if (isProtectedPath(request.nextUrl.pathname)) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // 정적 파일·이미지 최적화·파비콘·이미지 확장자를 제외한 모든 경로에서 세션을 갱신한다.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
