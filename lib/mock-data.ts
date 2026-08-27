import type { Folder, LinkItem } from "./types";

export const folders: Folder[] = [
  { id: "dev", name: "개발", linkCount: 4 },
  { id: "design", name: "디자인", linkCount: 2 },
  { id: "reading", name: "읽을거리", linkCount: 2 },
  { id: "tools", name: "도구", linkCount: 1 },
];

export const links: LinkItem[] = [
  {
    id: "1",
    title: "Next.js Docs",
    description: "App Router, 서버 컴포넌트, 캐싱까지 공식 문서 모음.",
    url: "https://nextjs.org/docs",
    folderId: "dev",
    createdAt: "2026-08-20",
  },
  {
    id: "2",
    title: "React 공식 문서",
    description: "훅, 컴포넌트 설계, 동시성 렌더링 레퍼런스.",
    url: "https://react.dev",
    folderId: "dev",
    createdAt: "2026-08-19",
  },
  {
    id: "3",
    title: "TypeScript Handbook",
    description: "제네릭과 유틸리티 타입 정리가 잘 되어 있는 핸드북.",
    url: "https://www.typescriptlang.org/docs/",
    folderId: "dev",
    createdAt: "2026-08-18",
  },
  {
    id: "4",
    title: "MDN Web Docs",
    description: "웹 표준 API와 CSS 속성을 찾아볼 때 첫 번째로 보는 곳.",
    url: "https://developer.mozilla.org",
    folderId: "dev",
    createdAt: "2026-08-15",
  },
  {
    id: "5",
    title: "Tailwind CSS",
    description: "유틸리티 클래스 목록과 테마 커스터마이징 가이드.",
    url: "https://tailwindcss.com",
    folderId: "design",
    createdAt: "2026-08-14",
  },
  {
    id: "6",
    title: "Refactoring UI",
    description: "개발자를 위한 실용적인 UI 디자인 팁 모음.",
    url: "https://www.refactoringui.com",
    folderId: "design",
    createdAt: "2026-08-12",
  },
  {
    id: "7",
    title: "웹 성능 최적화 체크리스트",
    description: "이미지, 폰트, 번들 사이즈까지 단계별 점검 항목.",
    url: "https://web.dev/fast/",
    folderId: "reading",
    createdAt: "2026-08-10",
  },
  {
    id: "8",
    title: "좋은 커밋 메시지 작성법",
    description: "협업 시 히스토리를 읽기 쉽게 남기는 방법.",
    url: "https://cbea.ms/git-commit/",
    folderId: "reading",
    createdAt: "2026-08-08",
  },
  {
    id: "9",
    title: "Excalidraw",
    description: "손그림 느낌의 다이어그램을 빠르게 그리는 화이트보드.",
    url: "https://excalidraw.com",
    folderId: "tools",
    createdAt: "2026-08-05",
  },
];
