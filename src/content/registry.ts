import type { GuidanceEntry } from "@/lib/contracts";

// Nothing is enabled until evidence, permissions, review and evaluation arrive.
export const conditions = [{ conditionId: "coffee_leaf_rust", crop: "coffee", plantPart: "leaf", enabled: false, reviewStatus: "pending", evaluationStatus: "pending", imagePermissionStatus: "pending" }] as const;
export const guidanceEntries: GuidanceEntry[] = [];
export const reviewedFollowUpQuestions: readonly string[] = [];
