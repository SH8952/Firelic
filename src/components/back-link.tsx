/**
 * 목록/도구/약관류 페이지 상단에 쓰는 "← 홈으로" 뒤로가기 링크.
 * 브라우저 기록이 아니라 고정된 상위 경로(홈)로 이동한다.
 * 홈 화면, 가이드 상세 글(자체 탐색 구조 보유)에는 쓰지 않는다.
 */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="mb-4 inline-block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
    >
      {label}
    </a>
  );
}
