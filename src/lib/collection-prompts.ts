import type { CollectionPrompt, ModelOutput, PhotoMeta, StarterAnswer } from "./contracts";

export function collectionPrompts(checks: ModelOutput["photoChecks"], photos: PhotoMeta[], answers: StarterAnswer[]): CollectionPrompt[] {
  const prompts: CollectionPrompt[] = [];
  const supported = checks.filter((check) => check.crop === "coffee" && check.part === "leaf");
  const unclearPhotos = checks.filter((check) => check.crop !== "other" && check.part !== "other" && check.quality !== "usable");
  const eligible = supported.filter((check) => check.quality === "usable");
  if (unclearPhotos.length) prompts.push({ id: "replace_unclear_photos", photoIds: unclearPhotos.map((check) => check.photoId), questionId: null });
  else if (eligible.length) {
    const usablePhotos = photos.filter((photo) => eligible.some((check) => check.photoId === photo.id));
    const upper = usablePhotos.some((photo) => photo.side === "upper"), underside = usablePhotos.some((photo) => photo.side === "underside");
    if (!upper || !underside) prompts.push({ id: upper ? "add_underside" : underside ? "add_upper" : "identify_sides", photoIds: usablePhotos.map((photo) => photo.id), questionId: null });
  }
  for (const questionId of ["onset", "spread"] as const) {
    const answer = answers.find((item) => item.questionId === questionId);
    if (!answer?.optionIds.length || answer.optionIds.includes("not_sure")) prompts.push({ id: questionId === "onset" ? "record_onset" : "record_spread", photoIds: [], questionId });
  }
  return prompts.slice(0, 2);
}
