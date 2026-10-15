import { z } from "zod";
import { modelSchema, type ModelOutput } from "../contracts";
import { careSelectionSchema, targetEvidenceSchema, TARGET_IDS, type AdviceIssue } from "../advice-contracts";

// Optional advice is normalized separately; malformed core evidence still fails strictly.
export function parseModelOutput(raw: unknown): ModelOutput {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return modelSchema.parse(raw);
  const input = { ...raw } as Record<string, unknown>;
  const issues: AdviceIssue[] = [];
  const care = z.array(z.unknown()).max(3).safeParse(input.careSelections ?? []);
  input.careSelections = care.success ? care.data.flatMap((item) => {
    const value = careSelectionSchema.safeParse(item); if (value.success) return [value.data]; issues.push("invalid_selection"); return [];
  }) : [];
  if (!care.success) issues.push("invalid_selection");
  if (Array.isArray(input.possibleCauses)) input.possibleCauses = input.possibleCauses.map((item: unknown) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return item;
    const cause = { ...item } as Record<string, unknown>;
    const target = z.enum(TARGET_IDS).nullable().safeParse(cause.targetId ?? null);
    const signs = z.array(targetEvidenceSchema).max(2).safeParse(cause.targetEvidence ?? []);
    if (!target.success || !signs.success) issues.push("invalid_selection");
    return { ...cause, targetId: target.success ? target.data : null, targetEvidence: signs.success ? signs.data : [] };
  });
  return { ...modelSchema.parse(input), adviceIssues: [...new Set(issues)] };
}
