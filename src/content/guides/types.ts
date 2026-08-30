export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** Publication date in KST (Asia/Seoul), formatted YYYY-MM-DD. */
  publishedAt: string;
  paragraphs: string[];
};

export type GuideCategory = {
  id: string;
  label: string;
};
