import type english from "@/content/locales/en.json";
import type { CheckedResult } from "./contracts";

export function findingHeadline(result: CheckedResult, text: typeof english.assessment): string {
  return result.visualFinding === "insufficient_evidence" ? text.findings[result.visualReason as Exclude<CheckedResult["visualReason"], "changes" | "no_changes">] : text.findings[result.visualFinding];
}
