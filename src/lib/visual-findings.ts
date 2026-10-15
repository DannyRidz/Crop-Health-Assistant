import type { CheckedResult, ModelOutput } from "./contracts";

export function visualFindings(output: ModelOutput): Pick<CheckedResult, "visualFinding" | "visualReason" | "keyObservationIds" | "excludedPhotoIds"> {
  const excludedPhotoIds = output.photoChecks.filter((check) => check.quality !== "usable" || check.crop !== "coffee" || check.part !== "leaf").map((check) => check.photoId);
  const eligible = output.observations.filter((item) => item.photoIds.every((id) => !excludedPhotoIds.includes(id)));
  const changes = eligible.some((item) => item.feature !== "unclear" && item.feature !== "no_distinct_change");
  const noChanges = !excludedPhotoIds.length && !!eligible.length && !output.contradictions.length &&
    eligible.every((item) => item.feature === "no_distinct_change") && output.photoChecks.every((check) => eligible.some((item) => item.photoIds.includes(check.photoId)));
  const visualFinding = changes ? "changes_visible" : noChanges ? "no_clear_changes" : "insufficient_evidence";
  const visualReason = changes ? "changes" : noChanges ? "no_changes" :
    output.photoChecks.some((check) => check.crop === "other" || check.part === "other") ? "unsupported" :
    output.photoChecks.some((check) => check.crop === "unclear" || check.part === "unclear") ? "unclear_subject" :
    output.photoChecks.some((check) => check.quality !== "usable") ? "quality" : "unclear_observations";
  return { visualFinding, visualReason, keyObservationIds: eligible.slice(0, 3).map((item) => item.id), excludedPhotoIds };
}
