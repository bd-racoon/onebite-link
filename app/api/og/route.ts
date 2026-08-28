import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export interface OpenGraphResult {
  url: string;
  title: string;
  description: string;
  image: string;
}

const FETCH_TIMEOUT_MS = 10_000;
const MAX_HTML_BYTES = 500_000;

// 봇 차단을 피하기 위해 실제 브라우저처럼 요청한다.
const BROWSER_HEADERS: Record<string, string> = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  "upgrade-insecure-requests": "1",
};

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&#x0*27;|&apos;/gi, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/** content-type 헤더나 <meta charset> 을 참고해 올바른 인코딩으로 디코딩한다. */
function decodeHtml(buffer: ArrayBuffer, contentType: string): string {
  const headerCharset = /charset=["']?([\w-]+)/i.exec(contentType)?.[1];
  const tryDecode = (charset: string) => {
    try {
      return new TextDecoder(charset, { fatal: false }).decode(buffer);
    } catch {
      return undefined;
    }
  };

  if (headerCharset) {
    const decoded = tryDecode(headerCharset);
    if (decoded !== undefined) return decoded;
  }

  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  const metaCharset = /<meta[^>]+charset=["']?([\w-]+)/i.exec(
    utf8.slice(0, 4000),
  )?.[1];

  if (metaCharset && !/^utf-?8$/i.test(metaCharset)) {
    const decoded = tryDecode(metaCharset);
    if (decoded !== undefined) return decoded;
  }

  return utf8;
}

/** <meta property|name="key" content="..."> 를 속성 순서와 무관하게 찾는다. */
function readMeta(html: string, keys: string[]): string | undefined {
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*?content=["']([^"']*)["']`,
        "i",
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']*)["'][^>]*?(?:property|name)=["']${escaped}["']`,
        "i",
      ),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) return decodeEntities(match[1]);
    }
  }
  return undefined;
}

function readTitleTag(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? decodeEntities(match[1]) : undefined;
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    const cause =
      error.cause instanceof Error ? error.cause.message : error.cause;
    return cause ? `${error.message} (${String(cause)})` : error.message;
  }
  return String(error);
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url");

  if (!target) {
    return Response.json(
      { error: "url 쿼리 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }
  } catch {
    return Response.json(
      { error: "http(s)로 시작하는 올바른 URL을 입력해 주세요." },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(parsed, {
      signal: controller.signal,
      redirect: "follow",
      cache: "no-store",
      headers: { ...BROWSER_HEADERS, referer: parsed.origin },
    });

    if (!response.ok) {
      return Response.json(
        { error: `대상 페이지에서 오류가 반환되었습니다. (${response.status})` },
        { status: 502 },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !/html|xml|text\/plain/i.test(contentType)) {
      return Response.json(
        {
          error: `오픈 그래프를 읽을 수 없는 형식입니다. (${contentType.split(";")[0]})`,
        },
        { status: 415 },
      );
    }

    const buffer = await response.arrayBuffer();
    const html = decodeHtml(buffer, contentType).slice(0, MAX_HTML_BYTES);

    const rawImage = readMeta(html, [
      "og:image",
      "og:image:url",
      "og:image:secure_url",
      "twitter:image",
      "twitter:image:src",
    ]);

    let image = "";
    if (rawImage) {
      try {
        image = new URL(rawImage, response.url || parsed).toString();
      } catch {
        image = "";
      }
    }

    const result: OpenGraphResult = {
      url: readMeta(html, ["og:url"]) ?? response.url ?? parsed.toString(),
      title:
        readMeta(html, ["og:title", "twitter:title"]) ??
        readTitleTag(html) ??
        parsed.hostname,
      description:
        readMeta(html, [
          "og:description",
          "twitter:description",
          "description",
        ]) ?? "",
      image,
    };

    return Response.json(result);
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    const reason = describeError(error);
    console.error(`[api/og] ${parsed.toString()} 실패: ${reason}`);

    return Response.json(
      {
        error: aborted
          ? "대상 페이지 응답이 지연되어 시간이 초과되었습니다."
          : `대상 페이지를 불러오지 못했습니다. (${reason})`,
      },
      { status: aborted ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
