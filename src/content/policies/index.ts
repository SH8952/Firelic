import { en } from "./en";
import { ko } from "./ko";
import { ja } from "./ja";
import { es } from "./es";
import type { PolicyContent } from "./types";

const POLICIES: Record<string, PolicyContent> = { en, ko, ja, es };

export function getPolicyContent(locale: string): PolicyContent {
  return POLICIES[locale] ?? POLICIES.en;
}

export type { PolicyContent, PolicyPage } from "./types";
