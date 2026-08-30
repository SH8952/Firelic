export type PolicyPage = {
  title: string;
  updated: string;
  paragraphs: string[];
};

export type PolicyContent = {
  about: PolicyPage;
  privacy: PolicyPage;
  terms: PolicyPage;
  affiliateDisclosure: PolicyPage;
};
