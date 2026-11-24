export type PolicyPage = {
  title: string;
  updated: string;
  paragraphs: string[];
  /** 선택: 소제목이 있는 추가 구간(현재 한국어 소개 페이지에서만 사용). */
  sections?: { heading: string; paragraphs: string[] }[];
  /** 선택: "Last updated: 날짜" 대신 쓸 표기. */
  updatedLabel?: string;
};

export type PolicyContent = {
  about: PolicyPage;
  privacy: PolicyPage;
  terms: PolicyPage;
  affiliateDisclosure: PolicyPage;
  contact: PolicyPage;
};
