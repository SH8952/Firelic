import type { ComponentType } from "react";
import { RealEstateVsIndexTool } from "./RealEstateVsIndexTool";
import { InflationTool } from "./InflationTool";
import { RothVsTraditionalTool } from "./RothVsTraditionalTool";
import { guideDiagrams } from "../diagrams";

/** 가이드(MDX) 본문에서 `<RealEstateVsIndexTool />` 처럼 쓸 수 있는 미니 계산기 모음. */
export const guideTools = {
  RealEstateVsIndexTool,
  InflationTool,
  RothVsTraditionalTool,
  ...guideDiagrams,
} as unknown as Record<string, ComponentType>;
