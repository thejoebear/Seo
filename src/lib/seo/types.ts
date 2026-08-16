export type CheckStatus = "pass" | "warn" | "fail";

export type CheckCategory =
  | "Content"
  | "Meta"
  | "Social"
  | "Technical"
  | "Links"
  | "Images";

export interface SeoCheck {
  id: string;
  label: string;
  category: CheckCategory;
  status: CheckStatus;
  weight: number;
  details: string;
  recommendation?: string;
}

export interface SeoMetrics {
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  h1Count: number;
  h2Count: number;
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  imagesTotal: number;
  imagesMissingAlt: number;
}

export type Grade = "A" | "B" | "C" | "D" | "F";

export interface SeoReport {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  score: number;
  grade: Grade;
  checks: SeoCheck[];
  summary: { pass: number; warn: number; fail: number };
  metrics: SeoMetrics;
}
